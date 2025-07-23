// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import Server from socket.io

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const reservationRoutes = require('./routes/reservations');
const loyaltyRoutes = require('./routes/loyalty');
const adminRoutes = require('./routes/admin'); // Assuming you have admin routes

const app = express();
const server = http.createServer(app); // Create HTTP server from app
const io = new Server(server, { // Initialize Socket.IO with the HTTP server
    cors: {
        origin: 'http://localhost:3000', // Allow frontend origin
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from your React frontend
}));
app.use(express.json()); // Body parser for JSON

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Example: Listen for a client joining a specific order room
    socket.on('joinOrderRoom', (orderId) => {
        socket.join(orderId);
        console.log(`User ${socket.id} joined room for order: ${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io instance available to routes (e.g., for emitting events)
app.set('socketio', io);

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/admin', adminRoutes);

// NEW: M-Pesa Callback URL (This must be publicly accessible for Safaricom to hit it)
// This route should NOT have `protect` middleware as M-Pesa will not send a token.
app.post('/api/mpesa/callback', async (req, res) => {
    console.log('M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    const { stkCallback } = Body || {};

    if (stkCallback && stkCallback.CheckoutRequestID) {
        const { CheckoutRequestID, ResultCode, ResultDesc, MerchantRequestID, CallbackMetadata } = stkCallback;

        // Extract relevant data from CallbackMetadata
        let MpesaReceiptNumber = null;
        let Amount = null;
        let PhoneNumber = null;

        if (CallbackMetadata && CallbackMetadata.Item) {
            CallbackMetadata.Item.forEach(item => {
                switch (item.Name) {
                    case 'MpesaReceiptNumber':
                        MpesaReceiptNumber = item.Value;
                        break;
                    case 'Amount':
                        Amount = item.Value;
                        break;
                    case 'PhoneNumber':
                        PhoneNumber = item.Value;
                        break;
                }
            });
        }

        try {
            // Find the order associated with this CheckoutRequestID (you need to store it when initiating STK push)
            // For simplicity here, we'll assume the order ID is passed in AccountReference and can be extracted.
            // In a real system, you'd store CheckoutRequestID in your Order model temporarily.
            // Let's assume we stored `CheckoutRequestID` in the Order model as `mpesaCheckoutRequestID`.
            const Order = require('./models/Order'); // Import Order model here to avoid circular dependency
            const User = require('./models/User'); // Import User model
            const { sendSMS, sendEmail } = require('./utils/notifications'); // Import notification utils

            // Find the order by its CheckoutRequestID (if you stored it)
            // Or by a unique reference you passed in AccountReference during STK push.
            // For now, let's assume we can find the order by a reference that includes the Order ID
            // This is a simplification; a robust solution would store CheckoutRequestID in the Order.
            // For demonstration, we'll try to find by a reference that can be derived from the description.
            // A better way: when you initiate STK push, save CheckoutRequestID to the Order document.
            // Then, here, find by CheckoutRequestID.
            // For now, we'll update based on a hypothetical order ID passed in the `AccountReference`
            // (which we used as `Order ID` in `initiateSTKPush`).
            // This requires you to store the `CheckoutRequestID` in the `Order` model when initiating payment.
            // Let's add a `mpesaCheckoutRequestID` field to the Order model for this.
            // (This field was not added in 1.3, so you might need to add it manually or re-run the schema migration).
            // For now, we'll assume we can find the order by its ID which was part of AccountReference.
            // This is a weak link; for production, store CheckoutRequestID in Order.

            let orderIdFromRef = null;
            if (stkCallback.AccountReference) {
                // Assuming AccountReference was "Order <orderId>"
                const match = stkCallback.AccountReference.match(/Order (.*)/);
                if (match && match[1]) {
                    orderIdFromRef = match[1];
                }
            }

            let order;
            if (orderIdFromRef) {
                order = await Order.findById(orderIdFromRef);
            } else {
                // If orderIdFromRef is not found, try to find by CheckoutRequestID if stored
                order = await Order.findOne({ mpesaCheckoutRequestID: CheckoutRequestID });
            }

            if (!order) {
                console.error('Order not found for M-Pesa callback:', CheckoutRequestID, orderIdFromRef);
                return res.status(404).json({ message: 'Order not found for callback' });
            }

            const user = await User.findById(order.user);

            if (ResultCode === 0) { // Success
                order.paymentStatus = 'Paid';
                order.status = 'Confirmed';
                order.mpesaReceiptNumber = MpesaReceiptNumber; // Store receipt number

                // Award loyalty points
                const LOYALTY_POINTS_RATE = 0.01; // 1% of total amount as points
                const pointsEarned = Math.floor(order.totalAmount * LOYALTY_POINTS_RATE);
                order.loyaltyPointsEarned = pointsEarned;

                if (user) {
                    user.loyaltyPoints += pointsEarned;
                    await user.save();
                    // Send SMS and Email notifications
                    const smsMessage = `Dear ${user.name}, your order #${order._id.substring(0, 8)} has been confirmed and paid. M-Pesa Ref: ${MpesaReceiptNumber}. You earned ${pointsEarned} loyalty points!`;
                    sendSMS(user.contactNumber, smsMessage); // Assuming user has contactNumber
                    sendEmail(user.email, `Order #${order._id.substring(0, 8)} Confirmed & Paid!`,
                        `<p>Dear ${user.name},</p>
                         <p>Your order <strong>#${order._id.substring(0, 8)}</strong> has been successfully confirmed and paid.</p>
                         <p>M-Pesa Receipt Number: <strong>${MpesaReceiptNumber}</strong></p>
                         <p>Total Amount Paid: <strong>KES ${order.totalAmount.toFixed(2)}</strong></p>
                         <p>You earned <strong>${pointsEarned}</strong> loyalty points!</p>
                         <p>Thank you for choosing us!</p>`);
                }

            } else { // Failed or Cancelled
                order.paymentStatus = 'Failed';
                order.status = 'Cancelled'; // Or 'Payment Failed'
                // Revert loyalty points if they were redeemed during order creation and payment failed
                if (order.loyaltyPointsRedeemed > 0 && user) {
                    user.loyaltyPoints += order.loyaltyPointsRedeemed;
                    await user.save();
                }
                if (user) {
                    const smsMessage = `Dear ${user.name}, your M-Pesa payment for order #${order._id.substring(0, 8)} failed. Reason: ${ResultDesc}. Please try again.`;
                    sendSMS(user.contactNumber, smsMessage);
                    sendEmail(user.email, `Order #${order._id.substring(0, 8)} Payment Failed`,
                        `<p>Dear ${user.name},</p>
                         <p>Your M-Pesa payment for order <strong>#${order._id.substring(0, 8)}</strong> has failed.</p>
                         <p>Reason: ${ResultDesc}</p>
                         <p>Please try placing the order again.</p>
                         <p>We apologize for the inconvenience.</p>`);
                }
            }
            await order.save();
            res.status(200).json({ message: 'Callback processed successfully' });

        } catch (error) {
            console.error('Error processing M-Pesa callback:', error);
            res.status(500).json({ message: 'Server error processing callback' });
        }
    } else {
        res.status(400).json({ message: 'Invalid M-Pesa callback format' });
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Listen on server, not app
