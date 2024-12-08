const PurchasePlan = require("../models/purchasePlan");
const User = require("../models/user");
const Global = require("../models/global_model");

exports.addPurchasePlan = async (req, res) => {
    try{
        const {planName, amount, purchaseDate, expiry} = req.body;
        const userId = req.user.id;
        const userData = await User.findById(userId);
        if(userData.referred_by != null){
            const level1User = await User.findById(userData.referred_by);
            const level1UserPlans = await PurchasePlan.find({userId: userData.referred_by});
            const level1plan = level1UserPlans.filter(e => e.expiry > Date.now()).pop()?.planName;
            if(level1plan == 'silver'){
                level1User.wallet+=100;
                level1User.referral_money+=100;
                await level1User.save();
            }else if(level1plan == 'gold'){
                if(planName == 'silver'){
                    level1User.wallet+=100;
                    level1User.referral_money+=100;
                    await level1User.save();
                }else if(planName == 'gold' || planName == 'platinum'){
                    level1User.wallet+=250;
                    level1User.referral_money+=250;
                    await level1User.save();
                }
            }else if(level1plan == 'platinum'){
                if(planName == 'silver'){
                    level1User.wallet+=100;
                    level1User.referral_money+=100;
                    await level1User.save();
                }else if(planName == 'gold'){
                    level1User.wallet+=250;
                    level1User.referral_money+=250;
                    await level1User.save();
                }else if(planName == 'platinum'){
                    level1User.wallet+=500;
                    level1User.referral_money+=500;
                    await level1User.save();
                }
            }
            if(level1User.referred_by != null){
                const level2User = await User.findById(level1User.referred_by);
                const level2UserPlans = await PurchasePlan.find({userId: level1User.referred_by});
                const level2plan = level2UserPlans.filter(e => e.expiry > Date.now()).pop()?.planName;
                if(level2plan == 'silver'){
                    level2User.wallet+=50;
                    level2User.referral_money+=50;
                    await level2User.save();
                }else if(level2plan == 'gold'){
                    if(planName == 'silver'){
                        level2User.wallet+=50;
                        level2User.referral_money+=50;
                        await level2User.save();
                    }else if(planName == 'gold' || planName == 'platinum'){
                        level2User.wallet+=100;
                        level2User.referral_money+=100;
                        await level2User.save();
                    }
                }else if(level2plan == 'platinum'){
                    if(planName == 'silver'){
                        level2User.wallet+=50;
                        level2User.referral_money+=50;
                        await level2User.save();
                    }else if(planName == 'gold'){
                        level2User.wallet+=100;
                        level2User.referral_money+=100;
                        await level2User.save();
                    }else if(planName == 'platinum'){
                        level2User.wallet+=150;
                        level2User.referral_money+=150;
                        await level2User.save();
                    }
                }
                if(level2User.referred_by != null){
                    const level3User = await User.findById(level2User.referred_by);
                    const level3UserPlans = await PurchasePlan.find({userId: level2User.referred_by});
                    const level3plan = level3UserPlans.filter(e => e.expiry > Date.now()).pop()?.planName;
                    if(level3plan == 'silver'){
                        level3User.wallet+=25;
                        level3User.referral_money+=25;
                        await level3User.save();
                    }else if(level3plan == 'gold'){
                        if(planName == 'silver'){
                            level3User.wallet+=25;
                            level3User.referral_money+=25;
                            await level3User.save();
                        }else if(planName == 'gold' || planName == 'platinum'){
                            level3User.wallet+=50;
                            level3User.referral_money+=50;
                            await level3User.save();
                        }
                    }else if(level3plan == 'platinum'){
                        if(planName == 'silver'){
                            level3User.wallet+=25;
                            level3User.referral_money+=25;
                            await level3User.save();
                        }else if(planName == 'gold'){
                            level3User.wallet+=50;
                            level3User.referral_money+=50;
                            await level3User.save();
                        }else if(planName == 'platinum'){
                            level3User.wallet+=75;
                            level3User.referral_money+=75;
                            await level3User.save();
                        }
                    }
                }
            }
        }
        await PurchasePlan.create({planName, amount, userId, purchaseDate, expiry});
        res.send({status: true, message: "Plan purchased successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}


exports.uploadQrCode = async (req, res) => {
    try{
        const qrCodeImage = req.file;
        const qrCode = qrCodeImage.destination + qrCodeImage.filename;
        await Global.create({qrCode: qrCode});
        res.send({status: true, message: "QR Uploaded successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}
