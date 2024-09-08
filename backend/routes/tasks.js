const express = require('express');
const ParentTask = require('../model/ParentTask');
const SubTask = require('../model/SubTask');
const User = require('../model/User');
const router = express.Router();

// Get all parent tasks for a user
router.get('/', async (req, res) => {
  try {
    const tasks = await ParentTask.find({ user: req.user.id });
    // Mapping over the tasks array to extract the necessary fields
    const tasksResponse = tasks.map(task => ({
      id: task._id,
      title: task.title,
      description: task.description,
    }));
    return res.status(200).json({ tasks: tasksResponse });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create a new parent task
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { title, description } = req.body;
    const parentTask = new ParentTask({
      title,
      description,
      user: req.user.id
    });
    await parentTask.save();
    user.tasks.push(parentTask._id);
    await user.save();

    return res.status(201).json({ message: "Parent task created successfully"});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete a parent task and its subtasks
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete subtasks associated with the parent task
    const parentTask = await ParentTask.findOneAndDelete({ _id: id, user: req.user.id });
    if (!parentTask) return res.status(404).json({ error: 'Parent task not found' });

    await SubTask.deleteMany({ parentTask: parentTask._id });

    // Find the user and remove the parent task's ObjectId from the user's tasks array
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.tasks.pull(parentTask._id); // Remove the task ID from the array
    await user.save(); // Save the updated user

    return res.status(200).json({ message: 'Parent task and associated subtasks deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a parent task by ID with its subtasks
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await ParentTask.findOne({ _id: id, user: req.user.id }).populate('subTasks');

    if (!task) return res.status(404).json({ error: 'Parent task not found' });

    return res.status(200).json(task);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//get all the subtask based on the task by ID and the status of the subtask I want to see
router.get('/:id/:status', async (req, res) => {
  try {
    const { id, status } = req.params;
    // Fetch the parent task along with its subtasks
    const task = await ParentTask.findOne({ _id: id, user: req.user.id }).populate('subTasks');

    // Check if the parent task exists
    if (!task) return res.status(404).json({ error: "Parent task not found" });

    // Filter subtasks based on the status parameter
    const filteredSubTasks = task.subTasks.filter(subTask => subTask.status === status);

    // Return the filtered subtasks
    return res.status(200).json(filteredSubTasks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
