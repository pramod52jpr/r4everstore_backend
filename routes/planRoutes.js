const express = require("express");
const authVerify = require("../middlewares/auth");

const planRouter = express.Router();

const adminAuthVerify = require("../middlewares/adminAuth");
const uploads = require("../middlewares/multer_config");
const {addPurchasePlan, uploadQrCode, deleteQrCode, getPaymentQr, purchasePlanRequest, changePlanSetting} = require("../controllers/planController");

planRouter.post('/add_purchase_plan', authVerify, uploads.single('image'), addPurchasePlan);
planRouter.post('/upload_qr_code', adminAuthVerify, uploads.single('file'), uploadQrCode);
planRouter.post('/delete_qr_code', adminAuthVerify, deleteQrCode);
planRouter.get('/get_payment_qr', authVerify, getPaymentQr);
planRouter.get('/purchase_plan_request', adminAuthVerify, purchasePlanRequest);
planRouter.post('/change_plan_setting', adminAuthVerify, changePlanSetting);

module.exports = planRouter;