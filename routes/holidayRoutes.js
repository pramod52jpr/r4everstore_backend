const express = require("express");
const adminAuthVerify = require("../middlewares/adminAuth");

const holidayRouter = express.Router();

const {addHoliday, getHolidayData, updateHoliday, deleteHoliday} = require("../controllers/holidayController");

holidayRouter.post('/add_holiday', adminAuthVerify, addHoliday);
holidayRouter.get('/get_holidays', adminAuthVerify, getHolidayData);
holidayRouter.post('/update_holiday', adminAuthVerify, updateHoliday);
holidayRouter.post('/delete_holiday', adminAuthVerify, deleteHoliday);


module.exports = holidayRouter;