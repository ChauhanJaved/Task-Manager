const Task = require('../models/Task');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addTask = async (req, res) => {
    const { title, description, deadline, priority, completed } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            deadline,
            priority,
            completed,
            user: req.user.id
        });

        const task = await newTask.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    const { title, description, deadline, priority, completed } = req.body;

    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (deadline) taskFields.deadline = deadline;
    if (priority) taskFields.priority = priority;
    if (completed) taskFields.completed = completed;

    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, { $set: taskFields }, { new: true });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Task.findByIdAndRemove(req.params.id);

        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
