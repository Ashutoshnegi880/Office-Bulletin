const express = require("express");
const { verifyToken } = require("./blog/blog.middleware");
const userRouter = require("./users");
const blogRouter = require("./blog");
const chatRouter = require("./chats");

const apiRouter = express.Router();

apiRouter.use("/users", userRouter)

apiRouter.use("/blog",verifyToken, blogRouter)

apiRouter.use("/chat",verifyToken, chatRouter)

module.exports = apiRouter;