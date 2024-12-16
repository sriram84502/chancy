const Admin = require('../models/Admin');
const User = require('../models/User');
const Worker = require('../models/WorkerSchema');
const Booking = require('../models/BookingSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

// Admin Login
const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Get All Workers
const getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find().select('-password'); // Exclude passwords
        res.json(workers);
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Get All Bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('worker', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Update Booking Status
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = status;
        await booking.save();

        res.json({ message: 'Booking status updated', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Generate Report
const generateReport = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalWorkers = await Worker.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const completedBookings = await Booking.countDocuments({ status: 'Completed' });

        res.json({
            totalUsers,
            totalWorkers,
            totalBookings,
            completedBookings,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

module.exports = {
    adminLogin,
    getAllUsers,
    getAllWorkers,
    getAllBookings,
    updateBookingStatus,
    generateReport,
};
