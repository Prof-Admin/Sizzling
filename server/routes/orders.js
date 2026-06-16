const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many orders submitted. Please try again later.' },
});

const validateOrder = [
  body('serviceType')
    .isIn(['grazing', 'platter', 'full-service'])
    .withMessage('Invalid service type'),
  body('contact.name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name too long'),
  body('contact.email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('contact.phone')
    .trim().notEmpty().withMessage('Phone is required'),
  body('estimatedTotal')
    .isFloat({ min: 0 }).withMessage('Invalid total'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
      });
    }
    next();
  },
];

// POST /api/orders
router.post('/', orderLimiter, validateOrder, async (req, res) => {
  try {
    const { serviceType, contact, estimatedTotal, orderData } = req.body;

    const order = await Order.create({
      serviceType,
      contact,
      estimatedTotal,
      orderData,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Order saved.',
      data: { id: order._id },
    });
  } catch (err) {
    console.error('Order save error:', err);
    res.status(500).json({ success: false, message: 'Failed to save order.' });
  }
});

module.exports = router;
