const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// User Authentication and Profile Management
router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser);       // Login a user
router.get('/profile', authenticate, getUserProfile); // Get user's profile

module.exports = router;