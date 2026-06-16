const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET /api/menu
router.get('/', async (req, res) => {
  try {
    const { category, dietary, featured } = req.query;
    const filter = { isAvailable: true };

    if (category) filter.category = category;
    if (dietary) filter.dietary = { $in: dietary.split(',') };
    if (featured === 'true') filter.isFeatured = true;

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching menu items' });
  }
});

// GET /api/menu/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching item' });
  }
});

module.exports = router;
