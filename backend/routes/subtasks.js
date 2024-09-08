const express = require('express');
const ParentTask = require('../model/ParentTask');
const SubTask = require('../model/SubTask');
const router = express.Router();

// Get all subtasks for a parent task
router.get('/:id', async (req, res) => {
  try {
    const subtasks = await SubTask.find({ _id: req.params.id });
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

    return res.status(201).json({ message: "Subtask created successfully"});
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
    res.status(200).json({message : "subtask updated successfully"});
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

//to fetch all the subtask for a given date which it will filter on a dute date to match the date being pased in the url
router.get('/by-date/:date', async (req, res) => {
  const { date } = req.params;
  try {
    // Parse the provided date
    const startDate = new Date(date);
    const endDate = new Date(date);

    // Set the endDate to the end of the day (23:59:59.999)
    endDate.setUTCHours(23, 59, 59, 999);

    // Find subtasks where the dueDate falls within the start and end of the provided date
    // Populate the parentTask field with the parent task's name
    const subtasks = await SubTask.find({
      dueDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('parentTask', 'title'); // Populate with the name of the parent task

    res.status(200).json(subtasks);
  } catch (error) {
    console.error('Error fetching subtasks by date:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router
