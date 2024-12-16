const express = require('express');
const { createBooking, getUserBookings, getWorkerBookings, acceptBooking, completeBooking, getPendingBookings } = require('../controllers/bookingController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// User Bookings
router.post('/', authenticate, createBooking); // Create a new booking
router.get('/user', authenticate, getUserBookings); // Get bookings for a user

// Worker Bookings
router.get('/worker', authenticate, getWorkerBookings); // Get bookings for a worker
router.put('/:id/complete', authenticate, completeBooking); // Mark booking as completed
router.get('/pending', authenticate, getPendingBookings); // Get all pending bookings for workers
router.post('/:id/accept', authenticate, acceptBooking); // Accept a booking
module.exports = router;