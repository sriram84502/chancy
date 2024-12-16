const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    documents: [String], // Array of document URLs or file paths
    availability: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Worker', WorkerSchema);