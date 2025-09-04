import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// Get all menu items (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { available: true };

    // Filter by category if provided
    if (category) {
      query.category = new RegExp(category, 'i');
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const menuItems = await MenuItem.find(query)
      .sort({ category: 1, name: 1 });

    res.json({ menuItems });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get menu item by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ menuItem });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get menu categories (public)
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category', { available: true });
    res.json({ categories: categories.sort() });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;