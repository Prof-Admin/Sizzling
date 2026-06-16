const express = require('express');
const router = express.Router();
const MenuConfig = require('../models/MenuConfig');

router.get('/', async (req, res) => {
  try {
    const configs = await MenuConfig.find({ key: { $ne: 'payment-settings' } }, 'key data -_id');
    const result = {};
    for (const c of configs) result[c.key] = c.data;
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
