const express = require("express");
const profileRouter = express.Router();

const {viewProfile, updateProfile, getMyTeam} = require("../controllers/profileController");
const authVerify = require("../middlewares/auth");

profileRouter.get('/view_profile', authVerify, viewProfile);
profileRouter.post('/update_profile', authVerify, updateProfile);
profileRouter.get('/get_my_team', authVerify, getMyTeam);

module.exports = profileRouter;