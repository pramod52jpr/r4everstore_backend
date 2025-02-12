const mongoose = require("mongoose");

const purchasePlanSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User',
        },
        planName : {
            type : String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        purchaseDate: {
            type: Date,
            default: Date.now,
        },
        expiry: {
            type: Date,
        },
        image: {
            type: String,
        },
        status: {
            type: Boolean,
            default: false,
        },
        declined: {
            type: Boolean,
            default: false,
        }
    },
    {timestamps: {}}
)

module.exports = mongoose.model('PurchasePlan', purchasePlanSchema);