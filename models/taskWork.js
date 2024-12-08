const mongoose = require("mongoose");

const taskWorkSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        taskId: {
            type: mongoose.Schema.ObjectId,
            ref: "Task"
        },
        image: {
            type: String,
            default: null,
        },
        completed: {
            type: Boolean,
            default: false,
        }
    },
    {timestamps: {}}
)

module.exports = mongoose.model('TaskWork', taskWorkSchema);