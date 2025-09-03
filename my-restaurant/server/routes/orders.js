// backend/routes/orders.js
// API routes for managing customer orders.
// Includes creating orders, fetching user-specific orders, and (for admin) updating order status.

const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorizeAdmin } = require('../middleware/auth');
const { initiateSTKPush } = require('../utils/mpesa'); // Import M-Pesa utility
const { sendSMS, sendEmail } = require('../utils/notifications'); // Import notification utilities

const router = express.Router();

// Loyalty points configuration (e.g., 1 point per KES 100 spent)
const LOYALTY_POINTS_RATE = 0.01; // 1% of total amount as points

// @route   POST /api/orders
// @desc    Create a new order and initiate M-Pesa STK Push
// @access  Private
router.post('/', protect, async (req, res) => {
    const { items, orderType, deliveryAddress, contactNumber, loyaltyPointsToRedeem } = req.body;

    try {
        // Calculate total amount from items (to prevent client-side manipulation)
        let totalAmount = 0;
        const processedItems = items.map(item => {
            totalAmount += item.price * item.quantity;
            return {
                menuItem: item.menuItem,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            };
        });

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let pointsRedeemed = 0;
        let finalAmount = totalAmount;

        // Handle loyalty points redemption
        if (loyaltyPointsToRedeem && loyaltyPointsToRedeem > 0) {
            if (user.loyaltyPoints >= loyaltyPointsToRedeem) {
                const discountAmount = loyaltyPointsToRedeem; // 1 point = 1 KES discount
                if (discountAmount <= finalAmount) {
                    finalAmount -= discountAmount;
                    user.loyaltyPoints -= loyaltyPointsToRedeem;
                    pointsRedeemed = loyaltyPointsToRedeem;
                } else {
                    pointsRedeemed = Math.floor(finalAmount);
                    user.loyaltyPoints -= pointsRedeemed;
                    finalAmount = 0;
                }
            } else {
                return res.status(400).json({ message: 'Insufficient loyalty points' });
            }
        }

        const newOrder = new Order({
            user: req.user,
            items: processedItems,
            totalAmount: finalAmount, // Store the final amount after discount
            orderType,
            deliveryAddress: orderType === 'Delivery' ? deliveryAddress : undefined,
            contactNumber,
            loyaltyPointsRedeemed: pointsRedeemed,
            status: 'Pending', // Initial status before payment
            paymentStatus: 'Pending' // Initial payment status
        });

        const savedOrder = await newOrder.save();

        // Save updated user loyalty points (after redemption)
        await user.save();

        // --- Initiate M-Pesa STK Push ---
        const mpesaAmount = Math.max(1, Math.ceil(finalAmount)); // Round up to nearest integer, min 1
        const phoneNumber = contactNumber.startsWith('0') ? `254${contactNumber.substring(1)}` : contactNumber; // Format to 2547...

        const stkResponse = await initiateSTKPush(phoneNumber, mpesaAmount, savedOrder._id.toString());

        // Store CheckoutRequestID in order for later callback matching
        savedOrder.mpesaCheckoutRequestID = stkResponse.CheckoutRequestID; 
        await savedOrder.save();

        // Send initial SMS/Email for order placed
        const orderIdShort = savedOrder._id.toString().substring(0, 8);
        const orderPlacedSms = `Dear ${user.name}, your order #${orderIdShort} for KES ${savedOrder.totalAmount.toFixed(2)} has been placed. Please complete M-Pesa payment.`;
        sendSMS(savedOrder.contactNumber || user.contactNumber, orderPlacedSms);
        sendEmail(user.email, `Your Order #${orderIdShort} Has Been Placed!`,
            `<p>Dear ${user.name},</p>
             <p>Your order <strong>#${orderIdShort}</strong> has been successfully placed.</p>
             <p>Total Amount: <strong>KES ${savedOrder.totalAmount.toFixed(2)}</strong></p>
             <p>Please complete the M-Pesa payment initiated on your phone.</p>
             <p>Thank you for choosing us!</p>`);

        res.status(201).json({
            message: 'Order placed, awaiting M-Pesa payment confirmation.',
            orderId: savedOrder._id,
            mpesaResponse: stkResponse 
        });

    } catch (error) {
        console.error('Error creating order or initiating M-Pesa:', error);
        res.status(500).json({ message: error.message || 'Server error during order creation or payment initiation.' });
    }
});

// @route   GET /api/orders/myorders
// @desc    Get orders for the authenticated user
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user }).sort({ createdAt: -1 }).populate('items.menuItem', 'name price');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order (User initiated)
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.status === 'Pending' || order.status === 'Confirmed') {
            order.status = 'Cancelled';
            order.paymentStatus = 'Refunded'; 

            if (order.loyaltyPointsRedeemed > 0) {
                const user = await User.findById(req.user);
                if (user) {
                    user.loyaltyPoints += order.loyaltyPointsRedeemed;
                    await user.save();
                }
            }
            await order.save();

            const user = await User.findById(req.user);
            if (user) {
                const orderIdShort = order._id.toString().substring(0, 8);
                const smsMessage = `Dear ${user.name}, your order #${orderIdShort} has been cancelled.`;
                sendSMS(order.contactNumber || user.contactNumber, smsMessage);
                sendEmail(user.email, `Order #${orderIdShort} Cancelled`,
                    `<p>Dear ${user.name},</p>
                     <p>Your order <strong>#${orderIdShort}</strong> has been successfully cancelled.</p>
                     ${order.loyaltyPointsRedeemed > 0 ? `<p><strong>${order.loyaltyPointsRedeemed}</strong> loyalty points have been refunded to your account.</p>` : ''}
                     <p>We hope to serve you again soon.</p>`);
            }

            res.json({ message: 'Order cancelled successfully', order });
        } else {
            return res.status(400).json({ message: `Order cannot be cancelled in '${order.status}' status.` });
        }

    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only) and send notifications
// @access  Private (Admin)
router.put('/:id/status', protect, authorizeAdmin, async (req, res) => {
    const { status } = req.body;
    const io = req.app.get('socketio'); 

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        const user = await User.findById(order.user);
        if (user) {
            const orderIdShort = order._id.toString().substring(0, 8);
            let smsMessage = '';
            let emailSubject = '';
            let emailContent = '';

            switch (status) {
                case 'Confirmed':
                    smsMessage = `Dear ${user.name}, your order #${orderIdShort} has been confirmed!`;
                    emailSubject = `Order #${orderIdShort} Confirmed!`;
                    emailContent = `<p>Dear ${user.name},</p><p>Your order <strong>#${orderIdShort}</strong> has been confirmed.</p>`;
                    break;
                case 'Preparing':
                    smsMessage = `Dear ${user.name}, your order #${orderIdShort} is now being prepared.`;
                    emailSubject = `Order #${orderIdShort} is Being Prepared!`;
                    emailContent = `<p>Dear ${user.name},</p><p>Your order <strong>#${orderIdShort}</strong> is being prepared.</p>`;
                    break;
                case 'Out for Delivery':
                    smsMessage = `Dear ${user.name}, your order #${orderIdShort} is out for delivery!`;
                    emailSubject = `Your Order #${orderIdShort} is Out for Delivery!`;
                    emailContent = `<p>Dear ${user.name},</p><p>Your order <strong>#${orderIdShort}</strong> is now out for delivery.</p>`;
                    break;
                case 'Completed':
                    smsMessage = `Dear ${user.name}, your order #${orderIdShort} has been completed. Enjoy your meal!`;
                    emailSubject = `Order #${orderIdShort} Completed!`;
                    emailContent = `<p>Dear ${user.name},</p><p>Your order <strong>#${orderIdShort}</strong> has been completed.</p>`;
                    break;
                case 'Cancelled':
                    smsMessage = `Dear ${user.name}, your order #${orderIdShort} has been cancelled by admin.`;
                    emailSubject = `Order #${orderIdShort} Cancelled by Admin`;
                    emailContent = `<p>Dear ${user.name},</p><p>Your order <strong>#${orderIdShort}</strong> has been cancelled by admin.</p>`;
                    break;
                default:
                    break;
            }

            if (smsMessage) sendSMS(order.contactNumber || user.contactNumber, smsMessage);
            if (emailSubject) sendEmail(user.email, emailSubject, emailContent);
        }

        io.to(order._id.toString()).emit('orderStatusUpdate', { orderId: order._id, newStatus: status });

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/orders/:id/driver-location
// @desc    Update driver's live location for an order (Admin/Driver only)
// @access  Private (Admin)
router.put('/:id/driver-location', protect, authorizeAdmin, async (req, res) => {
    const { lat, lng } = req.body;
    const io = req.app.get('socketio'); 

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.driverLocation = { lat, lng };
        await order.save();

        io.to(order._id.toString()).emit('driverLocationUpdate', {
            orderId: order._id,
            location: { lat, lng }
        });

        res.json({ message: 'Driver location updated', location: { lat, lng } });
    } catch (error) {
        console.error('Error updating driver location:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
