const Booking = require('../models/BookingSchema');
const Worker = require('../models/WorkerSchema');
const User = require('../models/User');

// Create a new booking and notify all workers
const createBooking = async (req, res) => {
    const { service, info, date } = req.body;

    try {
        const booking = await Booking.create({
            user: req.user.id,
            service,
            info,
            date,
        });

        // Notify workers (e.g., via WebSocket, Push Notifications, etc.)
        // This logic assumes you have a real-time notification system in place

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Allow a worker to accept a booking
const acceptBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Check if the booking is already accepted
        if (booking.status !== 'Pending') {
            return res.status(400).json({ message: 'Booking already accepted' });
        }

        // Assign the booking to the current worker
        booking.worker = req.user.id;
        booking.status = 'Accepted';
        await booking.save();

        res.json({ message: 'Booking accepted successfully', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Mark a booking as completed by the worker
const completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Check if the booking is already completed
        if (booking.status === 'Completed') {
            return res.status(400).json({ message: 'Booking is already completed' });
        }

        // Only the assigned worker can mark it as completed
        if (booking.worker.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to complete this booking' });
        }

        booking.status = 'Completed';
        await booking.save();

        res.json({ message: 'Booking marked as completed', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Get pending bookings for workers
const getPendingBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'Pending' }).populate('user', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Get bookings for a user
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('worker', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Get bookings for a worker
const getWorkerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ worker: req.user.id }).populate('user', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

module.exports = { createBooking, acceptBooking, completeBooking, getPendingBookings, getUserBookings, getWorkerBookings };