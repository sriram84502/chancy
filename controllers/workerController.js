const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Worker = require('../models/WorkerSchema');
const { JWT_SECRET } = require('../config/constants');

// Register a new worker
const registerWorker = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if email already exists
        const existingWorker = await Worker.findOne({ email });
        if (existingWorker) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash password and create a new worker
        const hashedPassword = await bcrypt.hash(password, 10);
        const worker = await Worker.create({ name, email, password: hashedPassword,availability: true});
        res.status(201).json(worker);
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Login a worker
const loginWorker = async (req, res) => {
    const { email, password } = req.body;

    try {
        const worker = await Worker.findOne({ email });
        if (!worker) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, worker.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: worker._id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Get worker profile
const getWorkerProfile = async (req, res) => {
    try {
        const worker = await Worker.findById(req.user.id);
        res.json(worker);
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

// Update worker availability
const updateAvailability = async (req, res) => {
    try {
        const worker = await Worker.findById(req.user.id);
        if (!worker) return res.status(404).json({ message: 'Worker not found' });

        worker.availability = req.body.availability;
        await worker.save();

        res.json({ message: 'Availability updated successfully', availability: worker.availability });
    } catch (err) {
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

module.exports = { registerWorker, loginWorker, getWorkerProfile, updateAvailability };
