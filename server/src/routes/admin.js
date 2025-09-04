import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Reservation from '../models/Reservation.js';
import Transaction from '../models/Transaction.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders (admin only)
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 50 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.menuItem', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({ 
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status (admin only)
router.put('/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findById(id).populate('user');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Send notification if status changed
    if (oldStatus !== status) {
      try {
        await notificationService.notifyOrderStatusUpdate(order, order.user, status);
      } catch (notifError) {
        console.error('Order status notification failed:', notifError);
      }
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all reservations (admin only)
router.get('/reservations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, date, page = 1, limit = 50 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (date) {
      const queryDate = new Date(date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: queryDate, $lt: nextDay };
    }

    const reservations = await Reservation.find(query)
      .populate('user', 'name email phone')
      .sort({ date: 1, time: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reservation.countDocuments(query);

    res.json({ 
      reservations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin reservations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reservation status (admin only)
router.put('/reservations/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tableNumber } = req.body;
    
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const oldStatus = reservation.status;
    reservation.status = status;
    if (tableNumber) reservation.tableNumber = tableNumber;
    await reservation.save();

    // Send notification if status changed
    if (oldStatus !== status) {
      try {
        await notificationService.notifyReservationStatusUpdate(reservation, status);
      } catch (notifError) {
        console.error('Reservation status notification failed:', notifError);
      }
    }

    res.json({ message: 'Reservation status updated successfully', reservation });
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add menu item (admin only)
router.post('/menu', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image, ingredients, allergens, preparationTime } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Name, description, price, and category are required' });
    }

    const menuItem = new MenuItem({
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      ingredients: ingredients || [],
      allergens: allergens || [],
      preparationTime: preparationTime || 15,
      available: true
    });

    await menuItem.save();

    res.status(201).json({
      message: 'Menu item added successfully',
      menuItem
    });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update menu item (admin only)
router.put('/menu/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete menu item (admin only)
router.delete('/menu/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard stats (admin only)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalUsers,
      totalOrders,
      todayOrders,
      todayRevenue,
      pendingOrders,
      todayReservations,
      totalReservations
    ] = await Promise.all([
      User.countDocuments({ role: 'customer', isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'preparing'] } }),
      Reservation.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      Reservation.countDocuments()
    ]);

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        pendingOrders,
        todayReservations,
        totalReservations
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;