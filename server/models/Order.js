// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    orderType: {
        type: String,
        enum: ['Delivery', 'Pickup'],
        required: true
    },
    deliveryAddress: {
        type: String,
        required: function() { return this.orderType === 'Delivery'; } // Required only for delivery
    },
    contactNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: { // NEW: Track payment status
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    loyaltyPointsEarned: { // NEW: Points earned from this order
        type: Number,
        default: 0
    },
    loyaltyPointsRedeemed: { // NEW: Points redeemed for this order
        type: Number,
        default: 0
    },
    driverLocation: { // NEW: For GPS tracking
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    driverContact: { // NEW: Optional driver contact info for user
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);
