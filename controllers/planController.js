const PurchasePlan = require("../models/purchasePlan");
const User = require("../models/user");
const Global = require("../models/global_model");
const protocol = require("../protocol");
const { getObjectUrl } = require("../middlewares/s3_object_url");

exports.addPurchasePlan = async (req, res) => {
    try{
        const {planName, amount, purchaseDate, image, expiry, status, declined, planId} = req.body;
        if(status == true){
            const planData = await PurchasePlan.findById(planId);
            const choosedPlanName = planData?.planName;
            const userData = await User.findById(planData.userId)
            if(userData.referred_by != null){
                const level1User = await User.findById(userData.referred_by);
                const level1UserPlans = await PurchasePlan.find({userId: userData.referred_by});
                const level1plan = level1UserPlans.filter(e => e.expiry > Date.now()).pop()?.planName;
                if(level1plan == 'silver'){
                    level1User.wallet+=100;
                    level1User.referral_money+=100;
                    await level1User.save();
                }else if(level1plan == 'gold'){
                    if(choosedPlanName == 'silver'){
                        level1User.wallet+=100;
                        level1User.referral_money+=100;
                        await level1User.save();
                    }else if(choosedPlanName == 'gold' || choosedPlanName == 'platinum'){
                        level1User.wallet+=250;
                        level1User.referral_money+=250;
                        await level1User.save();
                    }
                }else if(level1plan == 'platinum'){
                    if(choosedPlanName == 'silver'){
                        level1User.wallet+=100;
                        level1User.referral_money+=100;
                        await level1User.save();
                    }else if(choosedPlanName == 'gold'){
                        level1User.wallet+=250;
                        level1User.referral_money+=250;
                        await level1User.save();
                    }else if(choosedPlanName == 'platinum'){
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
                        if(choosedPlanName == 'silver'){
                            level2User.wallet+=50;
                            level2User.referral_money+=50;
                            await level2User.save();
                        }else if(choosedPlanName == 'gold' || choosedPlanName == 'platinum'){
                            level2User.wallet+=100;
                            level2User.referral_money+=100;
                            await level2User.save();
                        }
                    }else if(level2plan == 'platinum'){
                        if(choosedPlanName == 'silver'){
                            level2User.wallet+=50;
                            level2User.referral_money+=50;
                            await level2User.save();
                        }else if(choosedPlanName == 'gold'){
                            level2User.wallet+=100;
                            level2User.referral_money+=100;
                            await level2User.save();
                        }else if(choosedPlanName == 'platinum'){
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
                            if(choosedPlanName == 'silver'){
                                level3User.wallet+=25;
                                level3User.referral_money+=25;
                                await level3User.save();
                            }else if(choosedPlanName == 'gold' || choosedPlanName == 'platinum'){
                                level3User.wallet+=50;
                                level3User.referral_money+=50;
                                await level3User.save();
                            }
                        }else if(level3plan == 'platinum'){
                            if(choosedPlanName == 'silver'){
                                level3User.wallet+=25;
                                level3User.referral_money+=25;
                                await level3User.save();
                            }else if(choosedPlanName == 'gold'){
                                level3User.wallet+=50;
                                level3User.referral_money+=50;
                                await level3User.save();
                            }else if(choosedPlanName == 'platinum'){
                                level3User.wallet+=75;
                                level3User.referral_money+=75;
                                await level3User.save();
                            }
                        }
                    }
                }
            }
            const purchPlan = await PurchasePlan.findById(planId);
            purchPlan.purchaseDate = purchaseDate;
            purchPlan.expiry = expiry;
            purchPlan.status = true;
            await purchPlan.save();
            res.send({status: true, message: "Plan Approved successfully"});
        }else if(declined == true){
            const purchPlan = await PurchasePlan.findById(planId);
            purchPlan.declined = true;
            await purchPlan.save();
            res.send({status: true, message: "Plan declined successfully"});
        }else{
            const userId = req.user.id;
            // const image = req.file;
            
            let myPlans = await PurchasePlan.find({userId: userId});
            myPlans = myPlans.filter(e => e.status == false && e.declined == false)
            const plan = myPlans.filter(e => e.expiry > Date.now()).pop()?.planName;
            if(plan) return res.send({status: false, message: "Wait for last uploaded plan response"});
            
            // const uploadImage = image.destination + image.filename;
            await PurchasePlan.create({planName, amount, userId, purchaseDate, expiry, image: image});
            res.send({status: true, message: "Plan purchase requested successfully"});
        }
    }catch(e){
        res.send({status: false, message: e.message});
    }
}


exports.uploadQrCode = async (req, res) => {
    try{
        const { qrCode } = req.body;
        // const qrCodeImage = req.file;
        // const qrCode = qrCodeImage.destination + qrCodeImage.filename;
        console.log(qrCode);
        
        let data = await Global.findOne();
        if(data){
            data.qrCode = qrCode;
            await data.save();
            return res.send({status: true, message: "QR Uploaded successfully"});;
        }
        await Global.create({qrCode: qrCode});
        res.send({status: true, message: "QR Uploaded successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.getPaymentQr = async (req, res) => {
    try{
        let data = await Global.findOne();
        const baseUrl = `${protocol}://${req.get('host')}/`;
        if(data != null){
            data = {...data._doc, qrCode: data.qrCode != null ? !data.qrCode.includes('uploads/') ? await getObjectUrl(data.qrCode) : baseUrl+data.qrCode : data.qrCode};
        }
        res.send({status: true, message: "Data fetched successfully", data: data});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}


exports.deleteQrCode = async (req, res) => {
    try{
        let data = await Global.findOne();
        if(data){
            data.qrCode = null;
            await data.save();
        }
        res.send({status: true, message: "Qr Code deleted successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.purchasePlanRequest = async (req, res) => {
    try{
        let data = await PurchasePlan.find().populate('userId');
        data = data.filter(e => e.status == false && e.declined == false && e.userId!=null);
        const baseUrl = `${protocol}://${req.get('host')}/`;
        // data = data.map(e => {
        //     return {...e._doc, image: baseUrl+e.image};
        // });
        let allData = [];
        for (let index = 0; index < data.length; index++) {
            const e = data[index];
            allData.push({...e._doc, image: !e.image.includes("uploads/") ? await getObjectUrl(e.image) : baseUrl+e.image});
        }
        if(allData.length == 0) return res.send({status: false, message: "No Pending requests"});
        res.send({status: true, message: "Data fetched successfully", data: allData});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.changePlanSetting = async (req, res) => {
    try{
        const {planName, lock} = req.body;
        let data = await Global.findOne();
        if(data){
            switch(planName){
                case 'silver': data.silverLock = lock;
                break;
                case 'gold': data.goldLock = lock;
                break;
                case 'platinum': data.platinumLock = lock;
                break;
                case 'diamond': data.diamondLock = lock;
                break;
                default: createdData = null;
            }
            await data.save();
            return res.send({status: true, message: "Plan setting Updated successfully"});;
        }
        let createdData = null;
        switch(planName){
            case 'silver': createdData = {silverLock: lock};
            break;
            case 'gold': createdData = {goldLock: lock};
            break;
            case 'platinum': createdData = {platinumLock: lock};
            break;
            case 'diamond': createdData = {diamondLock: lock};
            break;
            default: createdData = null;
        }
        if(createdData != null){
            await Global.create(createdData);
        }
        res.send({status: true, message: "Plan setting Updated successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.updateTermsConditions = async (req, res) => {
    try{
        const {termsConditions} = req.body;
        let data = await Global.findOne();
        if(data){
            data.termsConditions = termsConditions;
            await data.save();
            return res.send({status: true, message: "Terms & conditions updated successfully"});;
        }
        await Global.create({termsConditions: termsConditions});
        res.send({status: true, message: "Terms & conditions updated successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

exports.updateImpMsg = async (req, res) => {
    try{
        const {impMsg} = req.body;
        let data = await Global.findOne();
        if(data){
            data.impMsg = impMsg;
            await data.save();
            return res.send({status: true, message: "Notification updated successfully"});;
        }
        await Global.create({impMsg: impMsg});
        res.send({status: true, message: "Notification updated successfully"});
    }catch(e){
        res.send({status: false, message: e.message});
    }
}

// exports.addPurchasePlan = async (req, res) => {
//     try{
//         const {planName, amount, purchaseDate, expiry} = req.body;
//         const userId = req.user.id;
//         const userData = await User.findById(userId);
//         if(userData.referred_by != null){
//             const level1User = await User.findById(userData.referred_by);
//             const level1UserPlans = await PurchasePlan.find({userId: userData.referred_by});
//             const level1plan = level1UserPlans.filter(e => e.expiry > Date.now()).pop()?.planName;
//             if(level1plan == 'silver'){
//                 level1User.wallet+=100;
//                 level1User.referral_money+=100;
//                 await level1User.save();
//             }else if(level1plan == 'gold'){
//                 if(planName == 'silver'){
//                     level1User.wallet+=100;
//                     level1User.referral_money+=100;
//                     await level1User.save();
//                 }else if(planName == 'gold' || planName == 'platinum'){
//                     level1User.wallet+=250;
//                     level1User.referral_money+=250;
//                     await level1User.save();
//                 }
//             }else if(level1plan == 'platinum'){
//                 if(planName == 'silver'){
//                     level1User.wallet+=100;
//                     level1User.referral_money+=100;
//                     await level1User.save();
//                 }else if(planName == 'gold'){
//                     level1User.wallet+=250;
//                     level1User.referral_money+=250;
//                     await level1User.save();
//                 }else if(planName == 'platinum'){
//                     level1User.wallet+=500;
//                     level1User.referral_money+=500;
//                     await level1User.save();
//                 }
//             }
//             if(level1User.referred_by != null){
//                 const level2User = await User.findById(level1User.referred_by);
//                 const level2UserPlans = await PurchasePlan.find({userId: level1User.referred_by});
//                 const level2plan = level2UserPlans.filter(e => e.expiry > Date.now()).pop()?.planName;
//                 if(level2plan == 'silver'){
//                     level2User.wallet+=50;
//                     level2User.referral_money+=50;
//                     await level2User.save();
//                 }else if(level2plan == 'gold'){
//                     if(planName == 'silver'){
//                         level2User.wallet+=50;
//                         level2User.referral_money+=50;
//                         await level2User.save();
//                     }else if(planName == 'gold' || planName == 'platinum'){
//                         level2User.wallet+=100;
//                         level2User.referral_money+=100;
//                         await level2User.save();
//                     }
//                 }else if(level2plan == 'platinum'){
//                     if(planName == 'silver'){
//                         level2User.wallet+=50;
//                         level2User.referral_money+=50;
//                         await level2User.save();
//                     }else if(planName == 'gold'){
//                         level2User.wallet+=100;
//                         level2User.referral_money+=100;
//                         await level2User.save();
//                     }else if(planName == 'platinum'){
//                         level2User.wallet+=150;
//                         level2User.referral_money+=150;
//                         await level2User.save();
//                     }
//                 }
//                 if(level2User.referred_by != null){
//                     const level3User = await User.findById(level2User.referred_by);
//                     const level3UserPlans = await PurchasePlan.find({userId: level2User.referred_by});
//                     const level3plan = level3UserPlans.filter(e => e.expiry > Date.now()).pop()?.planName;
//                     if(level3plan == 'silver'){
//                         level3User.wallet+=25;
//                         level3User.referral_money+=25;
//                         await level3User.save();
//                     }else if(level3plan == 'gold'){
//                         if(planName == 'silver'){
//                             level3User.wallet+=25;
//                             level3User.referral_money+=25;
//                             await level3User.save();
//                         }else if(planName == 'gold' || planName == 'platinum'){
//                             level3User.wallet+=50;
//                             level3User.referral_money+=50;
//                             await level3User.save();
//                         }
//                     }else if(level3plan == 'platinum'){
//                         if(planName == 'silver'){
//                             level3User.wallet+=25;
//                             level3User.referral_money+=25;
//                             await level3User.save();
//                         }else if(planName == 'gold'){
//                             level3User.wallet+=50;
//                             level3User.referral_money+=50;
//                             await level3User.save();
//                         }else if(planName == 'platinum'){
//                             level3User.wallet+=75;
//                             level3User.referral_money+=75;
//                             await level3User.save();
//                         }
//                     }
//                 }
//             }
//         }
//         await PurchasePlan.create({planName, amount, userId, purchaseDate, expiry});
//         res.send({status: true, message: "Plan purchased successfully"});
//     }catch(e){
//         res.send({status: false, message: e.message});
//     }
// }