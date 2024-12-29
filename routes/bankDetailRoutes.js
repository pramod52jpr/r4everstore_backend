const express = require("express");
const authVerify = require("../middlewares/auth");
const adminAuthVerify = require("../middlewares/adminAuth");

const bankDetailRouter = express.Router();

const {getBankDetail, updateBankDetail, getAllBankDetails, addWithdrawRequest, getAllWithdrawRequest, sendMoneySuccess, getMyWithdrawals} = require("../controllers/bankDetailController");

bankDetailRouter.get('/get_bank_details', authVerify, getBankDetail);
bankDetailRouter.post('/update_bank_details', authVerify, updateBankDetail);
bankDetailRouter.get('/get_all_bank_details', adminAuthVerify, getAllBankDetails);

bankDetailRouter.post('/add_withdraw_request', authVerify, addWithdrawRequest);
bankDetailRouter.get('/get_all_withdraw_request', adminAuthVerify, getAllWithdrawRequest);
bankDetailRouter.post('/send_money_success', adminAuthVerify, sendMoneySuccess);
bankDetailRouter.get('/get_my_withdrawals', authVerify, getMyWithdrawals);

module.exports = bankDetailRouter;