// API routes for administrative functions.
// These routes are protected and require 'admin' role.

const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/users', protect, authorizeAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users (admin):', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/orders
// @desc    Get all orders (Admin only)
// @access  Private (Admin)
router.get('/orders', protect, authorizeAdmin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email') // Populate user details
            .populate('items.menuItem', 'name price') // Populate menu item details
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders (admin):', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/reservations
// @desc    Get all reservations (Admin only)
// @access  Private (Admin)
router.get('/reservations', protect, authorizeAdmin, async (req, res) => {
    try {
        const reservations = await Reservation.find({})
            .populate('user', 'name email') // Populate user details
            .sort({ date: -1, time: -1 });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching all reservations (admin):', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// You can add more admin routes here (e.g., update user role, delete user, etc.)

module.exports = router;
