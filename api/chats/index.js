const express = require("express");
const { getChats } = require("./chats.controller");

const chatRouter = express.Router();


chatRouter.post("/get-chats", getChats)


module.exports= chatRouter