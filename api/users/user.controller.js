const userService = require("./user.service");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (user) {
      if (user.verified) {
        // return res.send("user exists")
        return res.status(400).json({ message: "User Already Exists" });
      } else {
        // Send OTP via email
        return res.status(201).json({message: `OTP already sent to your mail`});
      }
    } else {
      const otp = Math.floor(1000 + Math.random() * 9000);
      await userService.createUser(email, password, otp, false);

      // Send OTP via email
      console.log(`OTP sent to your mail: ${otp}`)
      return res.status(201).send(`OTP sent to your mail: ${otp}`);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyUser = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    if (user.otp === otp) {
      await userService.updateUser(email, true);
      const token = jwt.sign({ id: user.email }, "Ashutosh", { expiresIn: "2h" });
      res.set("token", token)
      return res.json({ message: "OTP verified successfully, User Registered" });
    } else {
      return res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User Already Verified" });
    }

    const otp = await userService.resendOtp(email);

    // Send OTP via email
    return res.status(201).send(`OTP sent to your mail: ${otp}`);
  } catch (error) {
    return res.status(500).json({message: `Internal Server Error: ${error}`});
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.verifyUserCredentials(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res
        .status(401)
        .json({ message: "User not verified. Please verify OTP first." });
    }

    //Generate JWT token
    const token = jwt.sign({ id: user.email }, "Ashutosh", { expiresIn: "2h" });

    res.set("token", token)
    // res.session.token = token;
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.generateResetLink = async (req,res)=>{
  const {email} = req.body;
  //verify mail
  const resultAfterVerify = await userService.verifyEmail(email);
  if(resultAfterVerify){

    const token = jwt.sign({ id: email }, "Ashutosh", { expiresIn: "2h" });
  
    const resetLink = `http://localhost:80/resetPassword?token=${token}`
    res.send(resetLink)
  }else{
    res.status(401).json({message:"Email not Found or not Verified"})
  }
}

exports.resetPassword = async (req, res) => {
  const {newPass, confirmNewPass} = req.body;
  if(newPass !== confirmNewPass){
    res.status(400).json({message:"password mismatch"})
  }
  const token = req.query.token;
  console.log(token)

  if (!token) {
    res.status(401).json({message:"Token Invalid or Empty"});
  }
  try {
    const decoded = jwt.verify(token, "Ashutosh");
    const email = decoded.id;
    console.log(req.body)

    //Update password
    const result = await userService.resetPasswordInDB(email, newPass)
    if(result === 1){
      res.status(201).json({message:"Password Reset Succesfull"})
    }else{
      res.status(400).json({message:"Either User not verified or not exisits"})
    }
    
  } catch (error) {
    console.log(error);
    res.status(401).json({message:"Invalid Token"});
  }
};


exports.getProfile = async (req, res) => {
  try {
    const userid = req.params.userid;
    const profile = await userService.getProfile(userid)
    res.status(200).send(profile)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.addProfile = async (req, res) => {
  try {
    if(req.user.id !== req.body.userid){
      throw new Error("User Invalid to perform this task")
    }
    const profile = await userService.addProfile(req.body)
    res.status(200).send(profile)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
