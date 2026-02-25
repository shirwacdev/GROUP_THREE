<<<<<<< HEAD
const expre``
=======
const express = require('express');
const router = express.Router();

const { signIn, login } = require('../controller/Regestrer');

// Register a new admin
router.post('/register', signIn);

// Login existing admin
router.post('/login', login);

// Simple health check for the route
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

<<<<<<< HEAD
exports.router = router;
=======
>>>>>>> 0e13816244fb303e3b81188e14f286fad7be5ac8
>>>>>>> 2657665bfb37aa4ac57532f85e9b19636c371cff
