const express = require("express");
const path = require('path')
const {
  registerUser,
  verifyUser,
  resendOtp,
  userLogin,
  resetPassword,
  generateResetLink,
  getProfile,
  addProfile,
} = require("./user.controller");
const { verifyToken } = require("../blog/blog.middleware");

const userRouter = express.Router();

userRouter.post("/register", registerUser); // Generate OTP and Send Email
userRouter.patch("/verify", verifyUser); // Verify OTP and Mark User as Verified
userRouter.post("/resendOtp", resendOtp); // Resend OTP
userRouter.post("/login", userLogin); // Login (Now verifies if user is verified and checks password)

userRouter.get("/generateResetLink", (req, res) => {
  const filePath = path.join(__dirname, "../client/generateResetLink.html");
  res.sendFile(filePath);
});
userRouter.post("/generateResetLink", generateResetLink);


userRouter.get("/resetPassword", (req, res) => {
    const filePath = path.join(__dirname, "../client/reset-password.html");
    res.sendFile(filePath);
  });
userRouter.put("/resetPassword", resetPassword); //Rest password

userRouter.get("/profile/:userid", getProfile); //Get Profile
userRouter.post("/profile",verifyToken, addProfile); //add Profile

module.exports = userRouter;
