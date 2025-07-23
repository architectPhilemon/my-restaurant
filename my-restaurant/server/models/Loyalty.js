
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loyaltyTransactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {// 'Earn', 'Redeem'
        type: String,
        enum: ['Earn', 'Redeem'],
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    relatedOrder: {//  If points are earned/redeemed for an order
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);


// --- File: backend/middleware/auth.js ---
// Middleware to protect routes, en