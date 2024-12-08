const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        referred_by: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            default: null,
        },
        refer_code: {
            type: String,
            trim: true,
            default: null,
        },
        name : {
            type : String,
            required: true,
            trim : true,
        },
        phone: {
            required: true,
            type: String,
            validate : {
                validator: (value) => {
                    return value.length == 10;
                },
                message: "Please enter a valid phone No"
            }
        },
        password: {
            required: true,
            type: String,
            validate: {
                validator: (value) => {
                    return value.length >= 6;
                },
                message: "Please enter a long password",
            }
        },
        wallet: {
            type: Number,
            default: 0,
        },
        referral_money: {
            type: Number,
            default: 0,
        },
        type: {
            type: String,
            default: 'user'
        },
        age: {
            type: String,
            default: null,
        },
        gender: {
            type: String,
            default: null,
        },
        work: {
            type: String,
            default: null,
        },
        whatsappNo: {
            type: String,
            default: null,
        },
        location: {
            type: String,
            default: null,
        },
        blocked: {
            type: Boolean,
            default: false,
        }
    },
    {timestamps: {}}
)

module.exports = mongoose.model('User', userSchema);