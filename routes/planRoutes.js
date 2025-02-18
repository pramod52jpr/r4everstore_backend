const express = require("express");
const authVerify = require("../middlewares/auth");

const planRouter = express.Router();

const adminAuthVerify = require("../middlewares/adminAuth");
const uploads = require("../middlewares/multer_config");
const {addPurchasePlan, uploadQrCode, deleteQrCode, getPaymentQr, purchasePlanRequest, changePlanSetting, updateTermsConditions, updateImpMsg} = require("../controllers/planController");

planRouter.post('/add_purchase_plan', authVerify, addPurchasePlan);
planRouter.post('/upload_qr_code', adminAuthVerify, uploadQrCode);
planRouter.post('/delete_qr_code', adminAuthVerify, deleteQrCode);
planRouter.get('/get_payment_qr', authVerify, getPaymentQr);
planRouter.get('/purchase_plan_request', adminAuthVerify, purchasePlanRequest);
planRouter.post('/change_plan_setting', adminAuthVerify, changePlanSetting);
planRouter.post('/update_terms_conditions', adminAuthVerify, updateTermsConditions);
planRouter.post('/update_imp_msg', adminAuthVerify, updateImpMsg);

module.exports = planRouter;