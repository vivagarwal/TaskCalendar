const express = require('express');
const ParentTask = require('../model/ParentTask');
const SubTask = require('../model/SubTask');
const router = express.Router();

// Get all subtasks for a parent task
router.get('/:parentId', async (req, res) => {
  try {
    const subtasks = await SubTask.find({ parentTask: req.params.parentId });
    return res.status(200).json({ subtasks });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create a new subtask under a parent task
router.post('/:parentId', async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const parentTask = await ParentTask.findById(req.params.parentId);

    if (!parentTask) return res.status(404).json({ error: 'Parent task not found' });

    const subtask = new SubTask({
      title,
      description,
      status,
      dueDate,
      parentTask: parentTask._id
    });

    await subtask.save();

    // Add the subtask to the parent task
    parentTask.subTasks.push(subtask._id);
    await parentTask.save();

    return res.status(201).json({ message: "Subtask created successfully", subtask });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update a subtask
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subtask = await SubTask.findByIdAndUpdate(id, req.body, { new: true });

    if (!subtask) return res.status(404).json({ error: 'Subtask not found' });
    res.status(200).json(subtask);
  } catch (err) {
    res.status(400).json({ error: 'Invalid subtask data' });
  }
});

// Delete a subtask
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subtask = await SubTask.findByIdAndDelete(id);

    if (!subtask) return res.status(404).json({ error: 'Subtask not found' });

    // Remove the subtask reference from the parent task
    await ParentTask.updateOne(
      { subTasks: id },
      { $pull: { subTasks: id } }
    );

    return res.status(200).json({ message: 'Subtask deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router
