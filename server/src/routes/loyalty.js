import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

// Get my loyalty points
router.get('/points', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      loyaltyPoints: user.loyaltyPoints,
      message: `You have ${user.loyaltyPoints} loyalty points`,
      redemptionValue: user.loyaltyPoints, // 1 point = 1 KES
      minimumRedemption: 100
    });
  } catch (error) {
    console.error('Get loyalty points error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redeem loyalty points
router.post('/redeem', authenticateToken, async (req, res) => {
  try {
    const { points } = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!points || points <= 0) {
      return res.status(400).json({ error: 'Invalid points amount' });
    }

    if (user.loyaltyPoints < points) {
      return res.status(400).json({ error: 'Insufficient loyalty points' });
    }

    // Minimum redemption is 100 points
    if (points < 100) {
      return res.status(400).json({ error: 'Minimum redemption is 100 points' });
    }

    // Deduct points
    user.loyaltyPoints -= points;
    await user.save();

    // Calculate discount (1 point = 1 KES)
    const discountAmount = points;

    // Send notification
    try {
      await notificationService.notifyLoyaltyPointsRedeemed(user, points, discountAmount);
    } catch (notifError) {
      console.error('Loyalty redemption notification failed:', notifError);
    }

    res.json({
      message: 'Loyalty points redeemed successfully',
      pointsRedeemed: points,
      discountAmount,
      remainingPoints: user.loyaltyPoints
    });
  } catch (error) {
    console.error('Redeem loyalty points error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get loyalty history (bonus endpoint)
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get orders that earned points
    const orders = await Order.find({ 
      user: userId, 
      paymentStatus: 'paid',
      loyaltyPointsEarned: { $gt: 0 }
    }).select('loyaltyPointsEarned totalAmount createdAt').sort({ createdAt: -1 });

    const history = orders.map(order => ({
      type: 'earned',
      points: order.loyaltyPointsEarned,
      orderAmount: order.totalAmount,
      date: order.createdAt,
      description: `Earned from order of KES ${order.totalAmount}`
    }));

    res.json({ history });
  } catch (error) {
    console.error('Get loyalty history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;