const taskModel = require('../models/taskModel');

function shapeTask(task) {
    return { ...task, completed: !!task.completed };
}

// GET /tasks/
async function getTasks(req, res, next) {
    try {
        const tasks = await taskModel.getTasksByUserId(req.user.id);
        res.status(200).json({ success: true, count: tasks.length, data: tasks.map(shapeTask) });
    } catch(err) {
        next(err);
    }
}

//GET /tasks/:id
async function getTask(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const task = await taskModel.getTasksByUserId(id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task with id ${id} not found' });
        }

        if (task.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You do not have access to this task' });
        }

        res.status(200).json({ success: true, data: shapeTask(task) });
    } catch(err) {
        next(err);
    }
}

//POST /tasks
async function addTask(req, res, next) {
    try {
        const { title } = req.body;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ success: false, message: 'Title is required and must be a non-empty string' });
        }

        const newTask = await taskModel.createTask({ title, userId: req.user.id });
        res.status(201).json({ success: true, data: shapeTask(newTask) });
    } catch (err) {
        next(err);
    }
}

//PUT /tasks/:id
async function editTask(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const existing = await taskModel.getTaskById(id);

        if (!existing) {
            return res.status(404).json({ succes: false, message: `Task with id ${id} not found` });
        }
        if (existing.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You do not have access to this task' });
        }

        const { title, completed } =req.body;

        if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
            return res.status(400).json({ success: false, message: 'Title must be a non-empty string' });
        }
        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({ success: false, message: 'Completed must be a boolean' });
        }

        const updatedTask = await taskModel.updateTask(id, { title, completed });
        res.status(200).json({ success: true, data: shapeTask(updatedTask) });
    } catch (err) {
        next(err);
    }
}

// DELETE /tasks/:id
async function removeTask(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const existing = await taskModel.getTaskById(id);

        if (!existing) {
            return res.status(404).json({ success: false, message: `Taskwith id ${id} not found` })
        }
        if(existing.userId !== req.user.id){
            return res.status(403).json({ success: false, message: 'You do not have access to this task' });
        }

        await taskModel.deleteTask(id);
        res.status(200).json({ success: true, message: `Task ${id} deleted` });
    } catch (err) {
        next(err);
    }
}

module.exports = { getTasks, getTask, addTask, editTask, removeTask };