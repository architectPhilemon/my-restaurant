// API routes for managing table reservations.
// Includes creating reservations, fetching user-specific reservations, and (for admin) updating status.

const express = require('express');
const Reservation = require('../models/Reservation');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reservations
// @desc    Create a new reservation
// @access  Private
router.post('/', protect, async (req, res) => {
    const { date, time, numberOfGuests, specialRequests } = req.body;

    try {
        // Basic validation for date/time (can be expanded)
        const reservationDate = new Date(date);
        if (isNaN(reservationDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const newReservation = new Reservation({
            user: req.user,
            date: reservationDate,
            time,
            numberOfGuests,
            specialRequests
        });

        const savedReservation = await newReservation.save();
        res.status(201).json(savedReservation);

    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/reservations/myreservations
// @desc    Get reservations for the authenticated user
// @access  Private
router.get('/myreservations', protect, async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user }).sort({ date: -1, time: -1 });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/reservations/:id/status
// @desc    Update reservation status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', protect, authorizeAdmin, async (req, res) => {
    const { status } = req.body;

    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = status;
        await reservation.save();
        res.json({ message: 'Reservation status updated', reservation });
    } catch (error) {
        console.error('Error updating reservation status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

// --- File: backend/routes/loyalty.js ---
// API routes for loyalty program.