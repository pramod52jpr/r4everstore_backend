const mongoose = require("mongoose");

const globalSchema = mongoose.Schema(
    {
        qrCode: {
            type: String,
            default: null,
        },
    },
    {timestamps: {}}
)

module.exports = mongoose.model('Global', globalSchema);