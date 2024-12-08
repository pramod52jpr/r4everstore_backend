const express = require("express");
const authVerify = require("../middlewares/auth");

const planRouter = express.Router();

const adminAuthVerify = require("../middlewares/adminAuth");
const uploads = require("../middlewares/multer_config");
const {addPurchasePlan, uploadQrCode} = require("../controllers/planController");

planRouter.post('/add_purchase_plan', authVerify, addPurchasePlan);
planRouter.post('/upload_qr_code', adminAuthVerify, uploads.single('file'), uploadQrCode);

module.exports = planRouter;