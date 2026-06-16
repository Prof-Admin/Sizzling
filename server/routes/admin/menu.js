const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const MenuConfig = require('../../models/MenuConfig');

router.get('/:key', adminAuth, async (req, res) => {
  try {
    const config = await MenuConfig.findOne({ key: req.params.key });
    if (!config) return res.status(404).json({ success: false, message: 'Config not found.' });
    res.json({ success: true, data: config.data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/:key', adminAuth, async (req, res) => {
  try {
    const config = await MenuConfig.findOneAndUpdate(
      { key: req.params.key },
      { data: req.body.data, updatedBy: req.admin.email },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: config.data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
