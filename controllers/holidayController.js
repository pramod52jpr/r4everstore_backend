const Holiday = require("../models/holiday");

exports.addHoliday = async (req, res) => {
    try{
        const {title, day, month} = req.body;
        await Holiday.create({title, day, month});
        res.send({status: true, message: "Holiday added successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.getHolidayData = async (req, res) => {
    try{
        const data = await Holiday.find();
        if(data.length == 0) return res.send({status : false, message : "No Task Available"});
        res.send({status: true, message: "Data fetched successfully", data: data});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.updateHoliday = async (req, res) => {
    try{
        const {title, day, month, holidayId} = req.body;
        const holidayData = await Holiday.findById(holidayId);
        if(!holidayData) return res.send({status : false, message : "No Task Available"});
        holidayData.title = title;
        holidayData.day = day;
        holidayData.month = month;
        await holidayData.save();
        res.send({status: true, message: "Holiday Updated successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.deleteHoliday = async (req, res) => {
    try{
        const {holidayId} = req.body;
        await Holiday.findByIdAndDelete(holidayId);
        res.send({status: true, message: "Holiday Deleted successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}