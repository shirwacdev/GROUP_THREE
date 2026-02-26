const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/StudentController');
const { getQuestions, getCategories, submitScore, getLeaderboard } = require('../controller/QuizController');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Quiz routes
router.get('/questions', getQuestions);
router.get('/categories', getCategories);
router.post('/submit-score', submitScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;