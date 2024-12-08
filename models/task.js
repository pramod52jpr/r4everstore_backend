const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
    {
        link: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
        }
    },
    { timestamps: {}},
)

module.exports = mongoose.model('Task', taskSchema);