const User = require("../models/user");

exports.viewProfile = async (req, res) => {
    try{
        const id = req.user.id;
        const user = await User.findById(id).select("-password -__v -_id");
        if(!user) return res.send({status: false, message: "User doesn't exist"});
        res.send({status: true, message: "Data fetched successfully", data: user});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.updateProfile = async (req, res) => {
    try{
        const {name, age, gender, work, whatsappNo, location} = req.body;
        const id = req.user.id;
        const user = await User.findById(id);
        if(!user) return res.send({status: false, message: "User doesn't exist"});
        user.name = name;
        user.age = age;
        user.gender = gender;
        user.work = work;
        user.whatsappNo = whatsappNo;
        user.location = location;
        await user.save();
        res.send({status: true, message: "User updated successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.getMyTeam = async (req, res) => {
    try{
        const id = req.user.id;
        let userData = await User.find({referred_by: id});
        userData = userData.map(e => {
            return {...e._doc, level: 1};
        })
        let level2Users = await User.find({referred_by: {$in: userData.map(e => e._id)}});
        level2Users = level2Users.map(e => {
            return {...e._doc, level: 2};
        })
        let level3Users = await User.find({referred_by: {$in: level2Users.map(e => e._id)}});
        level3Users = level3Users.map(e => {
            return {...e._doc, level: 3};
        })
        res.send({status: true, message: "Data fetched successfully", data: [...userData, ...level2Users, ...level3Users]});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}