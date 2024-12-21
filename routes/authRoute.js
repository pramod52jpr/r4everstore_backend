const express = require("express");
const authRouter = express.Router();

const {signup, signin, rechargeWallet, withdrawAmount, getSingleUser, getWalletData, getReferCode, blockUnblockUser, getAllUsersList, changePassword} = require("../controllers/authController");
const authVerify = require("../middlewares/auth");
const adminAuthVerify = require("../middlewares/adminAuth");

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/recharge_wallet', authVerify, rechargeWallet);
authRouter.post('/get_single_user', authVerify, getSingleUser);
authRouter.post('/withdraw_amount', authVerify, withdrawAmount);
authRouter.get('/get_wallet_data', authVerify, getWalletData);
authRouter.get('/get_refer_code', authVerify, getReferCode);
authRouter.post('/block_unblock_user', adminAuthVerify, blockUnblockUser);
authRouter.get('/get_all_users_list', adminAuthVerify, getAllUsersList);
authRouter.post('/change_password', authVerify, changePassword);


module.exports = authRouter;