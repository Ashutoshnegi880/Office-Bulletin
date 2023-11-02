const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const http = require("http");
const { Server } = require("socket.io");
const { storechat } = require("./api/chats/chats.service");
const Joi = require('joi');
const config = require("./properties.json")

const configSchema = Joi.object({
  PORT: Joi.number().port().default(80),
  pg_user: Joi.string().required(),
  pg_host: Joi.string().required(),
  pg_database: Joi.string().required(),
  pg_password: Joi.string().required(),
  pg_port: Joi.number().port().default(5432),
});


const validationResult = configSchema.validate(config)
console.log(validationResult)
if (validationResult.error) {
  throw new Error("Missing or empty properties in properties.json");
}

// const PORT = process.env.PORT || 80;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/client"));
app.use(bodyParser.json());
app.use(router);

let userSockets = new Map(); // Map to store user socket IDs used for chat
let onlineUsers = []; // Array to store online users

let emailSocketPosts = new Map();

io.on("connection", (socket) => {
  socket.on("user-Active", (msg) => {
    // Store user in map
    userSockets.set(msg.email, socket.id);
    onlineUsers = Array.from(new Set([...onlineUsers, msg.email]));
    io.emit("userAddedOrRemoved", onlineUsers);
  });

  socket.on("sendMessage", (data) => {
    const { senderEmail, recieverEmail, message } = data;
    const receiverSocket = userSockets.get(recieverEmail);
    const sendInfo = {
      senderEmail: senderEmail,
      message: message,
    };
    storechat(data);
    io.to(receiverSocket).emit("recievedMessage", sendInfo);
  });

  socket.on("seeing-blogs", (msg) => {
    emailSocketPosts.set(msg.email, socket.id);
  });

  socket.on("liked", (data) => {
    const { senderEmail, recieverEmail, likeCount, postid } = data;
    const receiverSocket = emailSocketPosts.get(recieverEmail);
    const sendInfo = {
      senderEmail: senderEmail,
      likeCount: likeCount,
      postid: postid,
    };
    io.to(receiverSocket).emit("likedNotification", sendInfo);
  });

  socket.on("disconnect", () => {
    for (const [key, value] of userSockets.entries()) {
      if (value === socket.id) {
        userSockets.delete(key);
        break; // Assuming there's only one entry with the specified value
      }
    }

    onlineUsers = Array.from(userSockets.keys());
    io.emit("userAddedOrRemoved", onlineUsers);
  });
});

app.get("/", (req, res) => {
  res.send();
});



server.listen(validationResult.value.PORT, () => {
  console.log(`Server running on port ${validationResult.value.PORT}`);
});
