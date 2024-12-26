const BankDetail = require("../models/bankdetail");
const Withdraw = require("../models/withdraw");
const User = require("../models/user");

exports.getBankDetail = async (req, res) => {
    try{
        const id = req.user.id;
        const bank = await BankDetail.findOne({userId: id}).select('-__v -_id -userId');
        if(!bank) return res.send({status: false, message: "Details doesn't exist"});
        res.send({status: true, message: "Data fetched successfully", data: bank});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.updateBankDetail = async (req, res) => {
    try{
        const {accountNo, bankName, ifscCode} = req.body;
        const id = req.user.id;
        if(accountNo.legth == 0 || bankName.length == 0 || ifscCode.length == 0) return res.send({status: false, message: "Fill all bank details correct"});
        const bank = await BankDetail.findOne({userId: id});
        if(!bank) return res.send({status: false, message: "Details doesn't exist"});
        var first = false;
        if(bank.accountNo.length == 0){
            first = true;
        }
        bank.accountNo = accountNo;
        bank.bankName = bankName;
        bank.ifscCode = ifscCode;
        await bank.save();
        const user = await User.findById(id);
        if(first == false){
            user.wallet-=500;
        }
        await user.save();
        res.send({status: true, message: "Bank details updated successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

// for admin


exports.getAllBankDetails = async (req, res) => {
    try{
        const id = req.user.id;
        let bankDetails = await BankDetail.find().populate('userId');
        bankDetails = bankDetails.filter(e => e.userId != null);
        res.send({status: true, message: "Data fetched successfully", data: bankDetails});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.addWithdrawRequest = async (req, res) => {
    try{
        const {amount} = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(amount > user.wallet) return res.send({status : false, message : "Amount should be less than your wallet"});
        user.wallet-=amount;
        await user.save();
        await Withdraw.create({userId, amount});
        res.send({status: true, message: "Withdraw requested successful"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.getAllWithdrawRequest = async (req, res) => {
    try{
        let requests = await Withdraw.find({success: false}).populate('userId');
        const bank = await BankDetail.find();
        requests = requests.map(e => {
            return {...e._doc, bankDetails: bank.filter(ele => ele.userId.toString() == e.userId._id.toString())[0]};
        })
        res.send({status: true, message: "Data fetched successfully", data: requests});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.sendMoneySuccess = async (req, res) => {
    try{
        const {withdrawId} = req.body;
        const withdrawData = await Withdraw.findById(withdrawId);
        withdrawData.success = true;
        await withdrawData.save();
        res.send({status: true, message: "Withdraw Status Updated"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}