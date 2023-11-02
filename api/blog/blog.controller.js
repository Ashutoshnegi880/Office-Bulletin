const { createBlog, createBlogWithImage, getAllBlogs, getMyPosts, getPaginatedBlogs, deletePost, updatePost, addLikesInBlogPostDB, removeLikesInBlogPostDB, addCommentToDb, getCommentsFromDB, updateLikeDB,  myLikes, deleteLikes, deleteComments } = require("./blog.services");

exports.postBlog = async (req, res) => {
  try {
    const result = await createBlog(req.body, req.user.id);
    res.status(201).json({ message: 'Blog created successfully', blog: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.postBlogImage = async (req, res) => {
  try {
    const result = await createBlogWithImage(req.body, req.user.id, req.file.buffer);
    res.status(201).json({ message: 'Blog created successfully', blog: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.fetchBlogs = async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getPaginatedBlogs = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const blogs = await getPaginatedBlogs(page);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postid } = req.body;
    const userid = req.user.id;
    await deleteLikes(postid);
    await deleteComments(postid);
    await deletePost(userid, postid);
    res.status(201).json({ message: 'Post Deleted' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.myPosts = async (req, res) => {
  try {
    const myPosts = await getMyPosts(req.user.id);
    res.status(200).send(myPosts);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { postid, title, category, image_url, description } = req.body;
    const userid = req.user.id;
    const result = await updatePost(userid, postid, title, category, image_url, description);
    if (result) {
      res.status(201).json({ message: 'Blog Updated successfully', blog: result });
    } else {
      res.status(401).json({ message: 'Post not found or User not allowed to delete post' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.checkLikesInLikesDB = async (req, res) => {
  try {
    const email = req.user.id;
    const result =  await myLikes(email)
    res.send(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

exports.likedPost = async (req, res) => {
  try {
    const { postid } = req.body;
    const email = req.user.id;
    const result = await updateLikeDB(postid, email);
    let likes;
    if(result === 1){
      likes = await addLikesInBlogPostDB(postid);
    }else{
      likes = await removeLikesInBlogPostDB(postid);
    }
    res.status(201).send({ message: 'Like count updated', likes: likes});
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

exports.addComments = async (req, res)=>{
  try {
    const {post_id, comment_text} = req.body
    const userid = req.user.id;
    await addCommentToDb(post_id, userid, comment_text);
    res.status(201).json({message: "Comment Added to DB"})
  } catch (error) {
    res.status(500).json({message: "Error Occured in adding comment to DB"})
  }
}


exports.getComments = async (req, res)=>{
  try {
    const {post_id} = req.body
    // const userid = req.user.id;
    const comments = await getCommentsFromDB(post_id);
    res.status(201).send(comments)
  } catch (error) {
    res.status(500).json({message: "Error Occured in adding comment to DB"})
  }
}