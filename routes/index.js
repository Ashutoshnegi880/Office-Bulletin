const express = require("express");
const apiRouter = require("../api");
var jwt = require("jsonwebtoken");
const path = require("path");
const router = express.Router();

const clientPath = path.join(__dirname, "../client");
router.use(express.static(clientPath));

router.get("/login", (req, res) => {
  res.sendFile(clientPath + "/login.html");
});

router.get("/signup", (req, res) => {
  res.sendFile(clientPath + "/signup.html");
});

router.get("/post", (req, res) => {
  res.sendFile(clientPath + "/post.html");
});

router.get("/blogs", (req, res) => {
  res.sendFile(clientPath + "/blogs.html");
});

router.get("/allposts", (req, res) => {
  res.sendFile(clientPath + "/allposts.html");
});

router.get("/myposts", (req, res) => {
  res.sendFile(clientPath + "/mypost.html");
});

router.get("/chat", (req, res) => {
  res.sendFile(clientPath + "/chat.html");
});

router.get("/registerUser", (req, res) => {
  res.sendFile(clientPath + "/registerUser.html");
});

router.get("/generateResetLink", (req, res) => {
  res.sendFile(clientPath + "/resetPassword.html");
});

router.get("/resetPassword", (req, res) => {
  res.sendFile(clientPath + "/reset-password-window.html");
});

router.get("/home", (req, res) => {
  res.sendFile(clientPath + "/home.html");
});
router.get("/profile/:userid", (req, res) => {
  res.sendFile(clientPath + "/profile.html");
});
router.get("/userDetails", (req, res) => {
  res.sendFile(clientPath + "/userDetail.html");
});


router.post("/verifyToken", (req, res) => {
  const token = req.header("token");
  if (!token) {
    res.status(401).send("Token Invalid or Empty");
  }
  try {
    const decoded = jwt.verify(token, "Ashutosh");
    console.log("Decoded: ", decoded);
    req.user = decoded;
    res.send(true)
  } catch (error) {
    res.send(false);
  }
});

router.use("/api", apiRouter);

module.exports = router;
