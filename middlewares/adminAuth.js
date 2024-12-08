const jwt = require("jsonwebtoken");
const User = require("../models/user");


const adminAuthVerify = async (req, res, next) => {
    try{
        const token = req.header('x-auth-token');
        if(!token) return res.send({status: false, message: "No auth token, access denied"});
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if(err){
                return res.send({status: false, message:err.message});
            }
            const userData = await User.findById(user.id);
            if(!userData) return res.send({status: false, message: "Invaid User"});
            if(userData.type != 'admin') return res.send({status: false, message: "Permission denied!"});
            req.user = user;
            req.token = token;
            next();
        });
    }catch(error){
        res.send({status: false, message: e.messagerror.message});
    }
}

module.exports = adminAuthVerify;