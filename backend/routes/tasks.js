const express = require('express');
const ParentTask = require('../model/ParentTask');
const SubTask = require('../model/SubTask');
const User = require('../model/User');
const router = express.Router();

// Get all parent tasks for a user
router.get('/', async (req, res) => {
  try {
    const tasks = await ParentTask.find({ user: req.user.id }).populate('subTasks');
    return res.status(200).json({ tasks });
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

    return res.status(201).json({ message: "Parent task created successfully", parentTask });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update an existing parent task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await ParentTask.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    ).populate('subTasks');

    if (!task) return res.status(404).json({ error: 'Parent task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Invalid task data' });
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

    res.status(200).json(task);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
