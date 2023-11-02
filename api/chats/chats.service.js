const pool = require("../dbConfig");

exports.storechat = async function (data) {
  let to = data.recieverEmail;
  let from = data.senderEmail;
  let message = data.message;
  try {
    await pool.query(
      "insert into chats(to_user, from_user, message) values($1, $2, $3)",
      [to, from, message]
    );
    return true;
  } catch {
    throw err;
  }
};

exports.getChats= async (currentUser, reciever) =>{
    try{
      const result = await pool.query("Select * FROM chats where (to_user = $1 AND from_user = $2) OR (to_user = $2 AND from_user = $1) order by msg_time",
      [currentUser, reciever]);
      return result.rows;
    }
    catch(error){
      console.log("ERROR--->", error)
      return [];
    }
}
