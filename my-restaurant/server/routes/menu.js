// API routes for managing menu items.
// Includes routes for getting all menu items and (for admin) adding/updating/deleting.

const express = require('express');
const MenuItem = require('../models/MenuItem');
const { protect, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({});
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/menu
// @desc    Add a new menu item (Admin only)
// @access  Private (Admin)
router.post('/', protect, authorizeAdmin, async (req, res) => {
    const { name, description, price, category, imageUrl, isAvailable } = req.body;

    try {
        const newItem = new MenuItem({
            name,
            description,
            price,
            category,
            imageUrl,
            isAvailable
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item (Admin only)
// @access  Private (Admin)
router.put('/:id', protect, authorizeAdmin, async (req, res) => {
    const { name, description, price, category, imageUrl, isAvailable } = req.body;

    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id, { name, description, price, category, imageUrl, isAvailable }, { new: true, runValidators: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item (Admin only)
// @access  Private (Admin)
router.delete('/:id', protect, authorizeAdmin, async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
