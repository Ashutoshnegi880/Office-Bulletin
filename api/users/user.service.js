const bcrypt = require("bcrypt");
const pool = require("../dbConfig");

exports.findUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (email, password, otp, verified) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO users(email, password, otp, verified) VALUES($1, $2, $3, $4)",
      [email, hashedPassword, otp, verified]
    );
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (email, verified) => {
  try {
    await pool.query("UPDATE users SET verified = $1 WHERE email = $2", [
      verified,
      email,
    ]);
  } catch (error) {
    throw error;
  }
};

exports.resendOtp = async (email) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    await pool.query("UPDATE users SET otp = $1 WHERE email = $2", [
      otp,
      email,
    ]);
    return otp;
  } catch (error) {
    throw error;
  }
};

exports.verifyUserCredentials = async (email, password) => {
  try {
    console.log("poool--->",pool)
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

exports.resetPasswordInDB = async function (email, password) {
  try {
    // const user = await pool.query("SELECT * FROM USERS WHERE email = $1", [email])

    // if(user.rows[0].verified){
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(password, salt);
    //   const result = await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
    //     hashedPassword,
    //     email,
    //   ]);
    //   return result.rowCount;
    // }else{
    //   return null;
    // }

    const salt = await bcrypt.genSalt(10);
    // console.log(salt, password, email);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword);
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    return result.rowCount;
  } catch (error) {
    throw error;
  }
};

exports.verifyEmail = async function (email) {
  const user = await pool.query("SELECT * FROM USERS WHERE email = $1", [
    email,
  ]);

  if (user.rows.length > 0 && user.rows[0].verified) {
    return true;
  } else {
    return false;
  }
};

exports.getProfile = async function (userid) {
  try {
    const profile = await pool.query(
      "SELECT * FROM PROFILE WHERE userid = $1",
      [userid]
    );
    return profile.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.addProfile = async function (userDetails) {
  try {
    const { userid, name, age, dob, bloodgroup, experience, maxqualification } = userDetails;
    const profile = await pool.query(
      `INSERT INTO profile (userid, name, age, dob, bloodgroup, experience, maxqualification) 
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, 
    [userid, name, age, dob, bloodgroup, experience, maxqualification]);
    return profile.rows[0];
  } catch (error) {
    throw error;
  }
};
