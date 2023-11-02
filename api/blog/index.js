const express = require("express");
const multer = require('multer');
const { postBlog, fetchBlogs, getPaginatedBlogs, deletePost, myPosts, updatePost, likedPost, postBlogImage, addComments, getComments, checkLikesInLikesDB } = require("./blog.controller");

const blogRouter = express.Router();
const upload = multer()

blogRouter.post("/post", postBlog)

blogRouter.post("/postUploadImage",upload.single('image'), postBlogImage)

blogRouter.post("/post", postBlog)
blogRouter.post("/getBlogs", fetchBlogs)
blogRouter.post("/getPaginatedBlogs", getPaginatedBlogs)
blogRouter.delete("/deletePost", deletePost)
blogRouter.post("/myPosts", myPosts)
blogRouter.put("/updatePost", updatePost)
blogRouter.put("/likedPost", likedPost)

blogRouter.post("/getcomments", getComments)
blogRouter.post("/addcomments", addComments)
blogRouter.post("/mylikes", checkLikesInLikesDB)

module.exports = blogRouter;