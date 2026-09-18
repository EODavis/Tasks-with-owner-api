const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const requireAuth = require('../middleware/auth');

// Apply requireAuth to every route defined below this line, on this router
router.use(requireAuth);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.addTask);
router.put('/:id', taskController.editTask);
router.delete('/:id', taskController.removeTask);

module.exports = router;