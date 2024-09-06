const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        default: null,
        required : true,
    },
    email: {
        type: String,
        unique: true,
        required : true,
    },
    password: {
        type: String,
        required : true,
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "ParentTask" }]
});

module.exports = mongoose.model("TaskCalendarUser", userSchema);