const { error } = require("console");
const pool = require("../dbConfig");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: "dmkeekjsr",
  api_key: "276498181872885",
  api_secret: "rbqdHcmeKjWEohOGE-hqGIZhx8M",
});

const bufferUpload = async (buffer) => {
  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
    const readStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    readStream.pipe(writeStream);
  });
};

exports.createBlog = async (
  { title, category, image_url, description },
  userid
) => {
  const query = `
    INSERT INTO blog_posts (userid, title, category, image_url, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [userid, title, category || "general", image_url, description];
  const result = await pool.query(query, values);
  return result.rows[0];
};

exports.createBlogWithImage = async (
  { title, category, description },
  userid,
  buffer
) => {
  
  const result = await bufferUpload(buffer);
  const image_url = result.url;

  return exports.createBlog(
    { title, category, image_url, description },
    userid
  );
};

exports.getAllBlogs = async () => {
  const result = await pool.query("SELECT * FROM blog_posts order by post_id");
  return result.rows;
};

exports.getPaginatedBlogs = async (page) => {
  const limit = 3;
  const totalBlogs = await pool.query("SELECT COUNT(*) FROM blog_posts");
  const totalPages = Math.ceil(totalBlogs.rows[0].count / limit);

  if (page > totalPages) {
    page = 1;
  }

  const offset = (page - 1) * limit;

  const query = `SELECT * FROM blog_posts LIMIT $1 OFFSET $2`;
  const values = [limit, offset];

  const result = await pool.query(query, values);
  return result.rows;
};

exports.deletePost = async (userid, postid) => {
  await pool.query("DELETE FROM blog_posts WHERE userid=$1 AND post_id =$2", [
    userid,
    postid,
  ]);
};

exports.getMyPosts = async (userid) => {
  const result = await pool.query(
    "SELECT * FROM blog_posts WHERE userid = $1 order by post_id",
    [userid]
  );
  return result.rows;
};

exports.updatePost = async (
  userid,
  postid,
  title,
  category,
  image_url,
  description
) => {
  const query = `
    UPDATE blog_posts 
    SET title = $2, category = $3, image_url = $4, description = $5
    WHERE userid = $1 AND post_id=$6
    RETURNING *
  `;

  const values = [
    userid,
    title,
    category || "general",
    image_url,
    description,
    postid,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

exports.myLikes = async (email) => {
  const result = await pool.query(`SELECT post_id FROM likes WHERE userid = $1`, [email]);

  const responseFromDB =result.rows;
  
  const postIdsArray = responseFromDB.map(item => item.post_id);
  
  return postIdsArray;
};


exports.addLikesInBlogPostDB = async (postid) => {
  const result = await pool.query(`SELECT * FROM blog_posts WHERE post_id = $1`, [postid]);
  const updatedResult = await pool.query(
    `UPDATE blog_posts SET likes = $1 WHERE post_id=$2 RETURNING *;`,
    [result.rows[0].likes + 1, postid]
  );
  return updatedResult.rows[0].likes;
};

exports.removeLikesInBlogPostDB = async (postid) => {
  const result = await pool.query(`SELECT * FROM blog_posts WHERE post_id = $1`, [postid]);
  const updatedResult = await pool.query(
    `UPDATE blog_posts SET likes = $1 WHERE post_id=$2 RETURNING *;`,
    [result.rows[0].likes - 1, postid]
  );
  return updatedResult.rows[0].likes;
};


exports.updateLikeDB = async (postid, email) => {
  try {
    const result = await pool.query(`SELECT * FROM likes WHERE post_id = $1 AND userid = $2`, [postid, email]);

    if (result.rowCount === 0) {
      await pool.query(`INSERT INTO likes (post_id, userid) VALUES ($1, $2) RETURNING *`, [postid, email]);
      return 1;
    } else {
      await pool.query(`DELETE FROM likes WHERE post_id = $1 AND userid = $2 RETURNING *`, [postid, email]);
      return 0;
    }
  } catch (error) {
    throw error;
  }
}

exports.addCommentToDb = async (post_id, userid, comment_text) => {
  try {
    const query = `
            INSERT INTO post_comments (post_id, userid, comment_text)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

    const values = [post_id, userid, comment_text];
    const result = await pool.query(query, values);

    return result.rows[0]; // Assuming you want to return the inserted comment
  } catch (error) {
    throw error;
  }
};

exports.getCommentsFromDB = async (post_id) => {
  try {

    const query = `
          SELECT * FROM post_comments WHERE post_id = $1
      `;

    const values = [post_id];
    const result = await pool.query(query, values);
    return result.rows; // Assuming you want to return the inserted comment
  } catch (error) {
    throw error;
  }
};

exports.deleteLikes = async (postid)=>{
  await pool.query("DELETE FROM likes where post_id=$1", [postid])
}
exports.deleteComments = async (postid)=>{
  await pool.query("DELETE FROM post_comments where post_id=$1", [postid])
}


module.exports;
