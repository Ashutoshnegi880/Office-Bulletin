var jwt = require('jsonwebtoken');

exports.verifyToken = function(req, res, next){
    const token = req.header("token");
    if(!token){
        res.status(401).send("Token Invalid or Empty")
    }
    try {
        const decoded = jwt.verify(token, 'Ashutosh');
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).send("Invalid Token")
    }
} 
