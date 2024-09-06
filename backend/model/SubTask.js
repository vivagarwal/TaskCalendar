const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed", "Postponed", "Suspended"],
    default: "To Do"
  },
  createdDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  parentTask: { type: mongoose.Schema.Types.ObjectId, ref: "ParentTask" }
});

module.exports = mongoose.model("SubTask", subTaskSchema);
