// Mongoose schema for table reservations.
// Stores details like date, time, number of guests, and user.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: { // Store as string for simplicity, e.g., "19:00"
        type: String,
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1
    },
    status: { // e.g., 'Pending', 'Confirmed', 'Cancelled', 'Completed'
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    specialRequests: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);

// --- File: backend/models/Loyalty.js ---
// Mongoose schema for loyalty 