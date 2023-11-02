getUserDetails();
function getUserDetails() {
  const userid = window.sessionStorage.email;
  axios.get(`http://localhost:80/api/users/profile/${userid}`).then(
    (response) => {
      console.log("UserDetails--->", response);
      if (response.data !== "") {
      } else {
        window.location.href = "/userDetails";
      }
    },
    (err) => {
      console.error(error.response.data.message);
    }
  );
}

function closeChatContainer() {
  document.getElementById("chat-box").innerHTML = "";
  document.getElementById("chat-container-div").style.display = "none";
}

viewAllPosts();
document.getElementById("userNameSpan").innerText = extractUsername(
  window.sessionStorage.email
);

document.getElementById("userNameSpan").addEventListener("click", function () {
  window.location.href = `http://localhost:80/profile/${window.sessionStorage.email}`;
});

document.getElementById("logout").addEventListener("click", function () {
  window.sessionStorage.clear();
  document.getElementById("modal-inner-text").innerText = `Loggin Out...`;
  $("#myModal").modal("show");

  setTimeout(() => {
    window.location.href = `http://localhost:80/`;
  }, 2000);
});

function extractUsername(email) {
  // Use the split method to separate the email into two parts
  console.log(email);
  if (!email) {
    window.sessionStorage.clear();
    console.log("Set modal-inner-txt");
    document.getElementById("modal-inner-text").innerText = `Redirecting...`;
    $(document).ready(function () {
      // Your Bootstrap-related code here
      $("#myModal").modal("show");
      setTimeout(() => {
        window.location.href = `http://localhost:80/`;
      }, 1000);
    });
  } else {
    var parts = email.split("@");

    // The first part (parts[0]) will be the username
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  }
}

function viewAllPosts() {
  const token = sessionStorage.token || "my_token";
  axios({
    method: "post",
    url: "http://localhost:80/api/blog/getBlogs",
    headers: {
      token: token,
    },
    data: {
      name: "ashu",
    },
  }).then(
    async (result) => {
      postContainer.innerHTML = "";
      let myLikedPosts = await axios({
        method: "post",
        url: "http://localhost:80/api/blog/mylikes",
        headers: {
          token: token,
        },
      });
      myLikedPosts = myLikedPosts.data;
      console.log("myLikedPosts-->", myLikedPosts);

      result.data.forEach((post) => {
        const postCard = document.createElement("div");
        postCard.classList.add("post-card");
        const like_Unlike = myLikedPosts.includes(post.post_id)
          ? "Unlike"
          : "Like";
        postCard.innerHTML = `
                <img src="${post.image_url}" alt="${post.title}">
                <div class="post-details">
                    <h6 id='email_${post.post_id}'>${post.userid}</h6>
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <p class="category">${post.category}</p>
                    <p>Likes: <span id="likesCount_${post.post_id}">${post.likes}</span></p>

                    <button class="post-button" id="likeBtn_${post.post_id}" onclick="likePost(${post.post_id})">${like_Unlike}</button>

                    <button class="show-comments" onclick="showComments(${post.post_id})">Show Comments</button>

                    <div id="commentContainer_${post.post_id}" class="comment-container" style="display:none;">
                        <!-- Comments will be displayed here -->
                    </div>

                    <div>
                        <input type="text" id="newComment_${post.post_id}" placeholder="Enter a new comment" required>
                        <button onclick="addComment(${post.post_id})">Add Comment</button>
                    </div>
                    <p id="${post.post_id}" style="display:none">${post.post_id}</p>
                </div>
            `;
        postContainer.appendChild(postCard);
      });
    },
    () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("email");
      alert("Session Expired");
      window.location.href = "/login";
    }
  );
}

async function addComment(postid) {
  const commentText = document.getElementById(`newComment_${postid}`).value;
  console.log("CommentText--->", commentText);
  if (commentText === "") {
    document.getElementById(
      "modal-inner-text"
    ).innerText = `Comment cannot be empty`;
    console.log("CommentText--->", commentText);
    $("#myModal").modal("show");
    setTimeout(() => {
      $("#myModal").modal("hide");
    }, 2000);
    return;
  }

  const token = sessionStorage.token || "my_token";
  try {
    const response = await axios({
      method: "post",
      url: "http://localhost:80/api/blog/addcomments",
      headers: {
        token: token,
      },
      data: {
        post_id: postid,
        comment_text: commentText,
      },
    });
    document.getElementById(`newComment_${postid}`).value = "";
    console.log("Comment added successfully!");
    // showComments(postid)

    const commentContainer = document.getElementById(
      `commentContainer_${postid}`
    );

    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");

    const timeAgo = moment(new Date()).fromNow();
    commentElement.innerHTML = `
            <div>
                <div class="content-comment">
                    <div class="user">
                        <h6>${window.sessionStorage.email}</h6>
                        <span class="is-mute">${timeAgo}</span>
                    </div>
                    <p>${commentText}</p>
                </div>
            </div>
        `;
    commentContainer.appendChild(commentElement);
    document.getElementById("modal-inner-text").innerText = `Comment Added`;
    console.log("CommentText--->", commentText);
    $("#myModal").modal("show");
    setTimeout(() => {
      $("#myModal").modal("hide");
    }, 2000);
    commentContainer.style.display = "inherit";
    return;
  } catch (error) {
    console.error(error.response.data.message);
  }
}

async function showComments(postid) {
  const commentContainer = document.getElementById(
    `commentContainer_${postid}`
  );
  if (commentContainer.style.display === "block") {
    commentContainer.style.display = "none";
    return;
  }
  commentContainer.style.display = "block";
  commentContainer.innerHTML = "";

  const token = sessionStorage.token || "my_token";
  console.log("Show Comments", postid);

  await axios({
    method: "post",
    url: "http://localhost:80/api/blog/getcomments",
    headers: {
      token: token,
    },
    data: {
      post_id: postid,
    },
  }).then(
    (response) => {
      console.log("Response-->", response);
      const comments = response.data;
      console.log("Comments-->", comments);

      // Loop through comments and add them to the container
      comments.forEach((comment) => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");

        const timeAgo = moment(comment.date_created).fromNow();
        commentElement.innerHTML = `
            <div>
                <div class="content-comment">
                    <div class="user">
                        <h6>${comment.userid}</h6>
                        <span class="is-mute">${timeAgo}</span>
                    </div>
                    <p>${comment.comment_text}</p>
                </div>
            </div>
        `;
        commentContainer.appendChild(commentElement);
      });
    },
    (err) => {
      // alert(err)
      console.error(err);
    }
  );
}

function myPosts() {
  const token = sessionStorage.token || "my_token";
  postContainer.innerHTML = "";
  axios({
    method: "post",
    url: "http://localhost:80/api/blog/myPosts",
    headers: {
      token: token,
    },
  }).then(
    (result) => {
      result.data.forEach((post) => {
        const postCard = document.createElement("div");
        postCard.classList.add("post-card");
        postCard.innerHTML = `
                <img src="${post.image_url}" alt="${post.title}">
                <div class="post-details">
                    <h6 id='email_${post.post_id}'>${post.userid}</h6>
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <p class="category">${post.category}</p>
                    <p>Likes: <span id="likesCount_${post.post_id}">${post.likes}</span></p>
                    <button class="post-button deleteButton" onclick="deletePost(${post.post_id})">Delete Post</button>

                    <button class="show-comments" onclick="showComments(${post.post_id})">Show Comments</button>

                    <div id="commentContainer_${post.post_id}" class="comment-container" style="display:none;">
                        <!-- Comments will be displayed here -->
                    </div>

                    <div>
                        <input type="text" id="newComment_${post.post_id}" placeholder="Enter a new comment">
                        <button onclick="addComment(${post.post_id})">Add Comment</button>
                    </div>
                    <p id="${post.post_id}" style="display:none">${post.post_id}</p>
                </div>
            `;
        postContainer.appendChild(postCard);
      });
    },
    () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("email");
      alert("Session Expired");
      window.location.href = "/login";
    }
  );
}

function createPostBox() {
  const display = document.getElementById("create-post-form").style.display;
  if (display === "none") {
    document.getElementById("create-post-form").style.display = "inherit";
  } else {
    document.getElementById("create-post-form").style.display = "none";
  }
}

const socket = io();

socket.emit("user-Active", {
  email: window.sessionStorage.email,
});

socket.on("userAddedOrRemoved", (res) => {
  const activeUsers = document.getElementById("active-users");
  let msg = "";
  res.forEach((element) => {
    msg += `<button type="button" onclick="selectedUser('${element}')" id="${element}">${element}</botton>`;
  });
  activeUsers.innerHTML = msg + "</br>";
  console.log(res);
});

socket.on("recievedMessage", (res) => {
  receiveMessage(res);
});

function sendMessage() {
  const message = document.getElementById("message").value;

  if (message === "") {
    // alert("Please fill out all fields.");
    document.getElementById(
      "modal-inner-text"
    ).innerText = `Message cannot be empty`;
    $("#myModal").modal("show");
    setTimeout(() => {
      $("#myModal").modal("hide");
    }, 1000);
    return;
  }
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `<span class="sent">${message}</span>`;
  chatBox.appendChild(messageElement);
  document.getElementById("message").value = "";
  console.log(message);

  const sendTo = document.getElementById("sendTo").innerText;
  socket.emit("sendMessage", {
    senderEmail: window.sessionStorage.email,
    recieverEmail: sendTo,
    message: message,
  });
  scrollToBottom();
}

// Function to receive a message
function receiveMessage(sendInfo) {
  // console.log(sendInfo)
  if(sendInfo.senderEmail === window.sessionStorage.email){
    return;
  }
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `<span class="received">${sendInfo.message}</span>`;
  chatBox.appendChild(messageElement);
  scrollToBottom();
}

socket.emit("seeing-blogs", {
  email: window.sessionStorage.email,
});

function deletePost(postid) {
  let conf = window.confirm("Want to delete?");
  if (!conf) {
    return;
  }

  const token = sessionStorage.token || "my_token";
  axios({
    method: "delete",
    url: "http://localhost:80/api/blog/deletePost",
    headers: {
      token: token,
    },
    data: {
      postid: postid,
    },
  }).then(
    (result) => {
      console.log(result);
      document.getElementById(
        "modal-inner-text"
      ).innerText = `Post Deleted Successfully`;
      $("#myModal").modal("show");
      setTimeout(() => {
        $("#myModal").modal("hide");
        myPosts();
      }, 2000);
    },
    (error) => {
      console.log(error);
      // alert(error.response.data.message)
      document.getElementById("modal-inner-text").innerText =
        "Error in deleting Post";
      $("#myModal").modal("show");
      setTimeout(() => {
        $("#myModal").modal("hide");
        myPosts();
      }, 2000);
    }
  );
}

function likePost(postid) {
  //Emmit like post
  const likeBtnTxt = document.getElementById(`likeBtn_${postid}`).innerText;

  if (likeBtnTxt === "Like") {
    document.getElementById(`likeBtn_${postid}`).innerText = "Unlike";
  } else {
    document.getElementById(`likeBtn_${postid}`).innerText = "Like";
  }

  axios({
    method: "put",
    url: "http://localhost:80/api/blog/likedPost",
    headers: {
      token: sessionStorage.token,
    },
    data: {
      postid: postid,
    },
  }).then(
    (result) => {
      const postOwner = document.getElementById(`email_${postid}`).innerText;
      // if (window.sessionStorage.email === postOwner) {
      //     document.getElementById(`email_${postid}`).innerText
      //     return;
      // }
      const likeCount = result.data.likes;
      document.getElementById(`likesCount_${postid}`).innerText = likeCount;
      socket.emit("liked", {
        senderEmail: window.sessionStorage.email,
        recieverEmail: postOwner,
        likeCount: likeCount,
        postid: postid,
      });
      console.log("Post liked and updated successfully");
    },
    (error) => {
      console.log(error);
    }
  );
}

socket.on("likedNotification", (msg) => {
  const currentLikes = parseInt(
    document.getElementById(`likesCount_${msg.postid}`).innerText
  );
  document.getElementById(`likesCount_${msg.postid}`).innerText = msg.likeCount;
  console.log(currentLikes);
  if (
    currentLikes > msg.likeCount ||
    msg.senderEmail === window.sessionStorage.email
  ) {
    // document.getElementById(`likesCount_${msg.postid}`).innerText = msg.likeCount;
    return;
  } else {
    // document.getElementById(`likesCount_${msg.postid}`).innerText = msg.likeCount;
    alert(`${msg.senderEmail} liked your post`);

    // document.getElementById("modal-inner-text").innerText = `${msg.senderEmail} liked your post`;
    // $("#myModal").modal("show");
    // setTimeout(()=>{
    //     $("#myModal").modal("hide");
    // },3000)
  }
});

var userid = window.sessionStorage.email;
document.getElementById("userid").value = userid;
function createPost() {
  // Get form values
  var title = document.getElementById("title").value;
  var userid = document.getElementById("userid").value;
  var category = document.getElementById("category").value;
  var image_url = document.getElementById("image_url").value;
  var description = document.getElementById("description").value;

  // if (!title || !userid || !category || !image_url || !description) {
  //     alert("Please fill out all fields.");
  //     return;
  // }
  // Prepare the request payload
  var payload = {
    title: title,
    userid: userid,
    category: category,
    image_url: image_url,
    description: description,
  };
  const token = sessionStorage.token || "my_token";
  // Make the POST request
  axios({
    method: "post",
    url: "http://localhost/api/blog/post",
    data: payload,
    headers: {
      token: token,
    },
  })
    .then(function (response) {
      console.log("Post created successfully:", response.data);
    })
    .catch(function (error) {
      console.error("Error creating post:", error);
    });
}

document
  .getElementById("create-post-form")
  .addEventListener("submit", createPost2);

function createPost2(e) {
  e.preventDefault();
  // Get form values
  var title = document.getElementById("title").value;
  var userid = document.getElementById("userid").value;
  var category = document.getElementById("category").value;
  const image = document.getElementById("image").files[0];
  var description = document.getElementById("description").value;

  if (!title || !userid || !category || !image || !description) {
    // alert("Please fill out all fields.");

    document.getElementById(
      "modal-inner-text"
    ).innerText = `Please fill out all fields.`;
    $("#myModal").modal("show");
    setTimeout(() => {
      $("#myModal").modal("hide");
    }, 2000);
    return;
  }

  // Prepare the request payload
  const formData = new FormData();
  formData.append("title", title);
  formData.append("userid", userid);
  formData.append("category", category);
  formData.append("image", image);
  formData.append("description", description);

  const token = sessionStorage.token || "my_token";
  console.log("Creating Post axios Request");
  // Make the POST request
  axios({
    method: "post",
    url: "http://localhost/api/blog/postUploadImage",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      token: token,
    },
  })
    .then(function (response) {
      console.log("Post created successfully:", response.data);
      // alert("Post created successfully");
      document.getElementById(
        "modal-inner-text"
      ).innerText = `Post created successfully`;
      $("#myModal").modal("show");
      setTimeout(() => {
        $("#myModal").modal("hide");
      }, 2000);
      createPostBox();
      viewAllPosts();
    })
    .catch(function (error) {
      console.error("Error creating post:", error);
      // alert(error.response.data.message);
      document.getElementById(
        "modal-inner-text"
      ).innerText = `Failed to crate Post`;
      $("#myModal").modal("show");
      setTimeout(() => {
        $("#myModal").modal("hide");
      }, 2000);
    });
}

function selectedUser(sendTo) {
  document.getElementById("chat-container-div").style.display = "inherit";
  // document.getElementById("chat-box").innerHTML = '';
  document.getElementById("sendTo").innerHTML = sendTo;

  console.log("Fetching Chats -->", window.sessionStorage.email, sendTo);
  axios({
    method: "post",
    url: "http://localhost:80/api/chat/get-chats",
    data: {
      recieverEmail: sendTo,
    },
    headers: {
      token: window.sessionStorage.token,
    },
  }).then(
    (result) => {
      const chatBox = document.getElementById("chat-box");
      chatBox.innerHTML = "";
      const messages = result.data;
      messages.forEach((msg) => {
        if (msg.from_user === window.sessionStorage.email) {
          const messageElement = document.createElement("div");
          messageElement.classList.add("message");
          messageElement.innerHTML = `<span class="sent">${msg.message}</span>`;
          chatBox.appendChild(messageElement);
        } else {
          const chatBox = document.getElementById("chat-box");
          const messageElement = document.createElement("div");
          messageElement.classList.add("message");
          messageElement.innerHTML = `<span class="received">${msg.message}</span>`;
          chatBox.appendChild(messageElement);
        }

        scrollToBottom();
      });
    },
    (err) => {
      return;
    }
  );
}

function scrollToBottom() {
  var chatContainer = document.getElementById("chat-box");
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
