const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BankDetail = require("../models/bankdetail");
const axios = require("axios");
const PurchasePlan = require("../models/purchasePlan");
// const accountSid = 'ACeec7b1f686fc5bba33d758c2c13b0435';
// const authToken = '888045bd95eb6dd881aa3c3af64eb5c8';
// const client = require('twilio')(accountSid, authToken);

exports.signup = async (req, res) => {
    try{
        const {name, phone, password, referCode, otp} = req.body;
        const totalUsers = await User.find();
        const existingUser = await User.findOne({phone});
        if(existingUser){
            return res.send({status: false, message: "User already exist"});
        }
        // if(otp){
        //     client.verify.v2.services("VAcaaf417f81e8a9b7de1c9ec7b0c21b6e")
        //         .verificationChecks
        //         .create({to: `+91${phone}`, code: otp})
        //         .then( async(verification_check) => {
        //             if(verification_check.status == 'approved'){
        //                 const hashedPassword = await bcryptjs.hash(password, 8);
    
        //                 let user = new User({
        //                     name,
        //                     password: hashedPassword,
        //                     phone,
        //                     type: totalUsers.length == 0 ? 'admin' : 'user',
        //                 });
        //                 user = await user.save();
        //                 user.refer_code = `${user._id.toString().slice(-4)}${Date.now().toString().slice(-4)}`;
        //                 await user.save();
        //                 if(referCode){
        //                     const referedByUser = await User.findOne({refer_code: referCode});
        //                     if(referedByUser){
        //                         user.referred_by = referedByUser._id;
        //                         await user.save();
        //                     }
        //                 }
        //                 await BankDetail.create({userId: user._id});
        //                 return res.status(201).json({status: true, message: "Resistration successful"});
        //             }else{
        //                 res.send({status: false, message: e});
        //             }
        //         }).catch(e => {
        //             console.log(e);
        //             return res.send({status: false, message: "Invalid code"});
        //         });
        // }else{
        //     client.verify.v2.services("VAcaaf417f81e8a9b7de1c9ec7b0c21b6e")
        //         .verifications
        //         .create({to: `+91${phone}`, channel: 'sms'})
        //         .then(verification => {
        //             return res.status(201).json({status: true, message: "Code sent"});
        //         }).catch(e => {
        //             console.log("the erro occue: "+ JSON.stringify(e));
        //             return res.send({status: false, message: "Something went wrong"});
        //         });
        // }
        const hashedPassword = await bcryptjs.hash(password, 8);
    
        let user = new User({
            name,
            password: hashedPassword,
            phone,
            type: totalUsers.length == 0 ? 'admin' : 'user',
        });
        user = await user.save();
        user.refer_code = `${user._id.toString().slice(-4)}${Date.now().toString().slice(-4)}`;
        await user.save();
        if(referCode){
            const referedByUser = await User.findOne({refer_code: referCode});
            if(referedByUser){
                user.referred_by = referedByUser._id;
                await user.save();
            }
        }
        await BankDetail.create({userId: user._id});
        return res.status(201).json({status: true, message: "Resistration successful"});
    }catch(e){
        res.send({status : false, message : e});
    }
}

exports.signin = async (req, res) => {
    try{
        const {phone, password} = req.body;
        const user = await User.findOne({phone});
        if(!user){
            return res.send({status: false, message: "User doesn't exist"});
        }        
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.send({status: false, message: "Incorrect Password"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        const userData = await User.findOne({phone}).select('-password -createdAt -updatedAt -__v');
        const myPlans = await PurchasePlan.find({userId: userData._id, status: true});
        const plan = myPlans.filter(e => e.expiry > Date.now()).pop()?.planName;
        res.send({status: true, message: "Login successful", token: token, data: userData, plan: plan ?? null});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.getSingleUser = async (req, res) => {
    try{
        const userId = req.user.id;
        const plan = req.plan;
        const userData = await User.findById(userId);  
        res.send({status: true, message: "Data fetched successfully", data: userData, plan: plan ?? null});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.getWalletData = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select('wallet -_id');
        if(!user) return res.send({status: false, message: "User doesn't exist"});
        res.send({status: true, message: "Data fetched successfully", data: user});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.rechargeWallet = async (req, res) => {
    try{
        const {amount} = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user) return res.send({status: false, message: "User doesn't exist"});
        user.wallet+=parseInt(amount);
        await user.save();
        res.send({status: true, message: "Recharge Successful"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.withdrawAmount = async (req, res) => {
    try{
        const {amount} = req.body;
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        if(!user) return res.send({status: false, message: "User doesn't exist"});
        user.wallet-=parseInt(amount);
        await user.save();
        res.send({status: true, message: "Withdrawal Successful"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}


exports.getReferCode = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select('refer_code -_id');
        if(!user) return res.send({status: false, message: "User doesn't exist"});
        res.send({status: true, message: "Withdrawal Successful", data: user});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.blockUnblockUser = async (req, res) => {
    try{
        const {userId, block} = req.body;
        const user = await User.findById(userId);
        if(!user) return res.send({status: false, message: "User doesn't exist"});
        user.blocked = block;
        await user.save();
        res.send({status: true, message: block ? "User blocked successfully": "User unblocked successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.getAllUsersList = async (req, res) => {
    try{
        let users = await User.find().select('-password');
        let userWithPlans = [];
        for(var index in users){
            let myPlans = await PurchasePlan.find({userId: users[index]._id});
            myPlans = myPlans.filter(e => e.status == true && e.declined == false);
            const plan = myPlans.filter(e => e.expiry > Date.now()).pop();
            userWithPlans.push({...users[index]._doc, plan: plan});
        }
        // users = users.map(async e => {
            // let myPlans = await PurchasePlan.find({userId: e.userId});
            // myPlans = myPlans.filter(e => e.status == true && e.declined == false)
            // const plan = myPlans.filter(e => e.expiry > Date.now()).pop();
            // return {...e, plan: 'plan'};
        // });
        res.send({status: true, message: "Users fetched successfully", data: userWithPlans});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.changePassword = async (req, res) => {
    try{
        const {password, confirmPassword} = req.body;
        const userId = req.user.id;
        if(password != confirmPassword) return res.send({status: false, message: "Confirm password is not same as password"});
        if(password.length < 8) return res.send({status: false, message: "Password must be at least 8 characters"});
        const hashedPassword = await bcryptjs.hash(password, 8);
        const user = await User.findById(userId);
        if(!user) return res.send({status: false, message: "User doesn't exist"});
        user.password = hashedPassword;
        user.wallet-=100;
        await user.save();
        res.send({status: true, message: 'Password chnages successfully'});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}