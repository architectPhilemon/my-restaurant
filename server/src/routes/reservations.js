import express from 'express';
import Reservation from '../models/Reservation.js';
import { authenticateToken } from '../middleware/auth.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

// Create reservation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { date, time, partySize, specialRequests } = req.body;
    const userId = req.user._id;
    const user = req.user;

    if (!date || !time || !partySize) {
      return res.status(400).json({ error: 'Date, time, and party size are required' });
    }

    // Validate date is in the future
    const reservationDate = new Date(date);
    if (reservationDate < new Date()) {
      return res.status(400).json({ error: 'Reservation date must be in the future' });
    }

    // Check for existing reservations at the same time (basic conflict check)
    const existingReservation = await Reservation.findOne({
      date: reservationDate,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingReservation) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    const reservation = new Reservation({
      user: userId,
      customerName: user.name,
      customerPhone: user.phone,
      customerEmail: user.email,
      date: reservationDate,
      time,
      partySize: parseInt(partySize),
      specialRequests,
      status: 'pending'
    });

    await reservation.save();

    // Send notifications
    try {
      await notificationService.notifyReservationCreated(reservation, user);
      await notificationService.notifyAdminNewReservation(reservation);
    } catch (notifError) {
      console.error('Reservation notification failed:', notifError);
    }

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: {
        id: reservation._id,
        date: reservation.date,
        time: reservation.time,
        partySize: reservation.partySize,
        status: reservation.status,
        specialRequests: reservation.specialRequests,
        createdAt: reservation.createdAt
      }
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get my reservations
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ user: userId })
      .sort({ date: -1, createdAt: -1 });

    res.json({ reservations });
  } catch (error) {
    console.error('Get my reservations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel reservation
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const reservation = await Reservation.findOne({ _id: id, user: userId });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel this reservation' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    // Send notification
    try {
      await notificationService.notifyReservationStatusUpdate(reservation, 'cancelled');
    } catch (notifError) {
      console.error('Cancel reservation notification failed:', notifError);
    }

    res.json({ message: 'Reservation cancelled successfully', reservation });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;