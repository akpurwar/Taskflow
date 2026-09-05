const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim : true

    },
     description: {
      type: String,
      trim: true,
      default: '',
    },
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,

    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
    },
    // Conflict-handling field: every update should check this matches the
    // client's known version before writing, then increment it. Prevents
    // silently overwriting a concurrent edit (see findOneAndUpdate usage
    // in the task controller, added later).
    version: {
      type: Number,
      default: 0,
    },

}, {
    timestamps: true
})


// Hottest read path: "all tasks for this project filtered by status"
// (this is what the Kanban board queries on every load)
TaskSchema.index({ projectId: 1, status: 1 }); // compoundindexing
 
// Supports a fast "my tasks" view without a full collection scan
TaskSchema.index({ assignee: 1 });

module.exports = mongoose.model("Task" , TaskSchema);