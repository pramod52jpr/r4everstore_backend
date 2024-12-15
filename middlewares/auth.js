const jwt = require("jsonwebtoken");
const User = require("../models/user");
const PurchasePlan = require("../models/purchasePlan");


const authVerify = async (req, res, next) => {
    try{
        const token = req.header('x-auth-token');
        if(!token) return res.send({status: false, message: "No auth token, access denied"});
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if(err){
                return res.send({status: false, message:err.message});
            }
            const userData = await User.findById(user.id);
            if(!userData) return res.send({status: false, message: "Invaid User"});
            let myPlans = await PurchasePlan.find({userId: user.id});
            myPlans = myPlans.filter(e => e.status == true && e.declined == false)
            const plan = myPlans.filter(e => e.expiry > Date.now()).pop()?.planName;

            req.user = user;
            req.token = token;
            req.plan = plan;
            next();
        });
    }catch(error){
        res.send({status: false, message: e.messagerror.message});
    }
}

module.exports = authVerify;