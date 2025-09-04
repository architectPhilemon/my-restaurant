import express from 'express';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, paymentMethod = 'mpesa', deliveryAddress, notes } = req.body;
    const userId = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    // Validate and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item ${item.menuItemId} not found` });
      }
      if (!menuItem.available) {
        return res.status(400).json({ error: `Menu item ${menuItem.name} is not available` });
      }

      const orderItem = {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity || 1,
        specialInstructions: item.specialInstructions || ''
      };

      orderItems.push(orderItem);
      totalAmount += orderItem.price * orderItem.quantity;
    }

    // Calculate loyalty points (1 point per 100 KES)
    const loyaltyPointsEarned = Math.floor(totalAmount / 100);

    // Calculate estimated delivery time
    const maxPrepTime = Math.max(...orderItems.map(item => 
      MenuItem.findById(item.menuItem).preparationTime || 15
    ));
    const estimatedDeliveryTime = new Date(Date.now() + (maxPrepTime + 30) * 60000); // Add 30 min buffer

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      loyaltyPointsEarned,
      loyaltyPointsUsed: 0,
      deliveryAddress,
      estimatedDeliveryTime,
      notes
    });

    await order.save();
    await order.populate('user', 'name email phone');

    // Send notifications
    try {
      await notificationService.notifyOrderCreated(order, req.user);
      await notificationService.notifyAdminNewOrder(order, req.user);
    } catch (notifError) {
      console.error('Order notification failed:', notifError);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        loyaltyPointsEarned: order.loyaltyPointsEarned,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get my orders
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate('items.menuItem', 'name image')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel order
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot cancel order that is not pending' });
    }

    order.status = 'cancelled';
    await order.save();

    // Send notification
    try {
      await notificationService.notifyOrderStatusUpdate(order, req.user, 'cancelled');
    } catch (notifError) {
      console.error('Cancel notification failed:', notifError);
    }

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;