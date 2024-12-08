const mongoose = require("mongoose");

const bankDetailsSchema = mongoose.Schema(
    {
        userId: {
            type : mongoose.Schema.ObjectId,
            ref: "User",
        },
        accountNo: {
            type: String,
            trim: true,
            default: '',
        },
        bankName : {
            type : String,
            trim : true,
            default: '',
        },
        ifscCode: {
            type: String,
            trim : true,
            default: '',
        },
    },
    {timestamps: {}}
)

module.exports = mongoose.model('BankDetail', bankDetailsSchema);