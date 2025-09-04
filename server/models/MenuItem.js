// Mongoose schema for menu items.
// Stores details about each dish or drink available in the restaurant.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: { // e.g., 'Appetizers', 'Main Course', 'Desserts', 'Drinks'
        type: String,
        required: true,
        trim: true
    },
    imageUrl: { // URL to an image of the menu item
        type: String,
        default: 'https://placehold.co/400x300/E0E0E0/000000?text=Food+Item' // Placeholder image
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);

// --- File: backend/models/Order.js