const express = require('express');
const {
    registerWorker,
    loginWorker,
    getWorkerProfile,
    updateAvailability,
} = require('../controllers/workerController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Worker Authentication and Profile Management
router.post('/register', registerWorker); // Register a new worker
router.post('/login', loginWorker);       // Login a worker
router.get('/profile', authenticate, getWorkerProfile); // Get worker's profile

// Worker Availability
router.put('/availability', authenticate, updateAvailability); // Update availability status

module.exports = router;
