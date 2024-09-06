const mongoose = require("mongoose");

const parentTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "TaskCalendarUser" },
  subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubTask" }]
});

module.exports = mongoose.model("ParentTask", parentTaskSchema);
