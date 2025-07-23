// API routes for loyalty program.
// Includes fetching user loyalty points and (for admin) managing points.

const express = require('express');
const User = require('../models/User');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/loyalty/my-points
// @desc    Get authenticated user's loyalty points
// @access  Private
router.get('/my-points', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('loyaltyPoints');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ loyaltyPoints: user.loyaltyPoints });
    } catch (error) {
        console.error('Error fetching loyalty points:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/loyalty/redeem
// @desc    Redeem loyalty points for a discount (user initiated)
// @access  Private
router.post('/redeem', protect, async (req, res) => {
    const { pointsToRedeem } = req.body;

    if (!pointsToRedeem || pointsToRedeem <= 0) {
        return res.status(400).json({ message: 'Please provide a valid number of points to redeem.' });
    }

    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.loyaltyPoints < pointsToRedeem) {
            return res.status(400).json({ message: 'Insufficient loyalty points.' });
        }

        // For simplicity, assume 1 point = 1 KES discount
        const discountAmount = pointsToRedeem;

        user.loyaltyPoints -= pointsToRedeem;
        await user.save();

        res.json({
            message: `Successfully redeemed ${pointsToRedeem} points for a KES ${discountAmount} discount!`,
            newLoyaltyPoints: user.loyaltyPoints,
            discountAmount
        });

    } catch (error) {
        console.error('Error redeeming loyalty points:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/loyalty/add-points/:userId
// @desc    Add loyalty points to a user (Admin only)
// @access  Private (Admin)
router.put('/add-points/:userId', protect, authorizeAdmin, async (req, res) => {
    const { points } = req.body;

    if (!points || points <= 0) {
        return res.status(400).json({ message: 'Please provide a valid number of points to add.' });
    }

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.loyaltyPoints += points;
        await user.save();

        res.json({
            message: `Successfully added ${points} points to ${user.name}.`,
            newLoyaltyPoints: user.loyaltyPoints
        });

    } catch (error) {
        console.error('Error adding loyalty points (admin):', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/loyalty/deduct-points/:userId
// @desc    Deduct loyalty points from a user (Admin only)
// @access  Private (Admin)
router.put('/deduct-points/:userId', protect, authorizeAdmin, async (req, res) => {
    const { points } = req.body;

    if (!points || points <= 0) {
        return res.status(400).json({ message: 'Please provide a valid number of points to deduct.' });
    }

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.loyaltyPoints < points) {
            return res.status(400).json({ message: 'User has insufficient loyalty points to deduct.' });
        }

        user.loyaltyPoints -= points;
        await user.save();

        res.json({
            message: `Successfully deducted ${points} points from ${user.name}.`,
            newLoyaltyPoints: user.loyaltyPoints
        });

    } catch (error) {
        console.error('Error deducting loyalty points (admin):', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

// --- File: backend/routes/admin.js ---
// API routes for administrative 