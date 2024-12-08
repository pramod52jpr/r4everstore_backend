const mongoose = require("mongoose");

const holidaySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        day : {
            type : Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
    },
    {timestamps: {}}
)

module.exports = mongoose.model('Holiday', holidaySchema);