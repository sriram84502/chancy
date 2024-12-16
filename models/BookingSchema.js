const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: String, required: true },
    info: { type: String }, // Additional information about the service
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', default: null },
    status: { type: String, default: 'Pending' }, // Pending, Accepted, Completed, etc.
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', BookingSchema);