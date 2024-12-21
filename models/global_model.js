const mongoose = require("mongoose");

const globalSchema = mongoose.Schema(
    {
        qrCode: {
            type: String,
            default: null,
        },
        silverLock: {
            type: Boolean,
            default: false,
        },
        goldLock: {
            type: Boolean,
            default: false,
        },
        platinumLock: {
            type: Boolean,
            default: false,
        },
        diamondLock: {
            type: Boolean,
            default: true,
        },
        termsConditions: {
            type: String,
            default: '',
        },
        impMsg: {
            type: String,
            default: '',
        }
    },
    {timestamps: {}}
)

module.exports = mongoose.model('Global', globalSchema);