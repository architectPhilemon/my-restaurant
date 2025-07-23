// Mongoose schema for user authentication.
// Stores user details including name, email, password, and loyalty points.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    role: { // Added for basic access control (e.g., 'user', 'admin')
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);

// --- File: backend/models/MenuItem.js