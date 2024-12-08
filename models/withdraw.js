const mongoose = require("mongoose");

const withdrawSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        amount: {
            type: Number,
            required: true
        },
        success: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: {}}
)

module.exports = mongoose.model('WithdrawRequest', withdrawSchema);