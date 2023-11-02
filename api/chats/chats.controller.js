const pool = require("../dbConfig");
const { getChats } = require("./chats.service");



// to_user TEXT NOT NULL,
// from_user TEXT NOT NULL,
// message TEXT NOT NULL,
// msg_time DATE

exports.getChats = async (req, res)=>{
    const currentUser = req.user.id;
    const reciever = req.body.recieverEmail;
    const result = await getChats(currentUser, reciever)
    res.status(200).send(result)
}

