const express = require('express');
const router = express.Router();
const {
  register, login, getStats,
  getCategories, createCategory, updateCategory, deleteCategory,
  createQuestion, deleteQuestion, getAllQuestions,
  getAllStudents, deleteStudent, updateStudentStatus,
} = require('../controller/AdminController');
const adminAuth = require('../middleware/AdminAuth');

// Public
router.post('/register', register);
router.post('/login', login);

// Protected
router.get('/stats', adminAuth, getStats);

// Categories
router.get('/categories', adminAuth, getCategories);
router.post('/categories', adminAuth, createCategory);
router.put('/categories/:id', adminAuth, updateCategory);
router.delete('/categories/:id', adminAuth, deleteCategory);

// Questions
router.get('/questions', adminAuth, getAllQuestions);
router.post('/questions', adminAuth, createQuestion);
router.delete('/questions/:id', adminAuth, deleteQuestion);

// Users
router.get('/students', adminAuth, getAllStudents);
router.put('/students/:id/status', adminAuth, updateStudentStatus);
router.delete('/students/:id', adminAuth, deleteStudent);

module.exports = { router };
