const express = require('express');
const {
    adminLogin,
    getAllUsers,
    getAllWorkers,
    getAllBookings,
    updateBookingStatus,
    generateReport,
} = require('../controllers/adminController');
const { authenticateAdmin } = require('../middlewares/adminMiddleware');

const router = express.Router();

// Admin Authentication
router.post('/login', adminLogin);

// Manage Users and Workers
router.get('/users', authenticateAdmin, getAllUsers); // Get all users
router.get('/workers', authenticateAdmin, getAllWorkers); // Get all workers

// Manage Bookings
router.get('/bookings', authenticateAdmin, getAllBookings); // Get all bookings
router.put('/bookings/:id/status', authenticateAdmin, updateBookingStatus); // Update booking status

// Generate Reports
router.get('/reports', authenticateAdmin, generateReport); // Generate analytics report

module.exports = router;
