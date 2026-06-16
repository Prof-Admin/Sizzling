const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const Order = require('../../models/Order');
const Enquiry = require('../../models/Enquiry');

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalOrders,
      newOrders,
      totalEnquiries,
      newEnquiries,
      ordersByType,
      recentOrders,
      recentEnquiries,
      revenueResult,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'new' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Order.aggregate([{ $group: { _id: '$serviceType', count: { $sum: 1 } } }]),
      Order.find().sort({ createdAt: -1 }).limit(5).select('serviceType contact estimatedTotal status createdAt'),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).select('name email eventType status createdAt'),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$estimatedTotal' } } }]),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        newOrders,
        totalEnquiries,
        newEnquiries,
        estimatedRevenue: revenueResult[0]?.total ?? 0,
        ordersByType,
        recentOrders,
        recentEnquiries,
      },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
