const express = require('express');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks, sortTasks, countTasksByStatus, getTaskHistory
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getAllTasks).post(protect, createTask);
router
  .route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);


router.get('/search', searchTasks);
router.get('/sort', sortTasks);
router.get('/count', countTasksByStatus);
router.get('/history', getTaskHistory);

module.exports = router;
