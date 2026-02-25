const express = require('express');
const router = express.Router();
const { signIn, login } = require('../controller/Regestrer');

// Register a new student
router.post('/register', signIn);   

router.post('/login', login);

// Simple health check for the route
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
 
exports.router = router;