const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Enquiry = require('../models/Enquiry');
const { validateEnquiry } = require('../middleware/validators');

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many enquiries submitted. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/enquiries
router.post('/', enquiryLimiter, validateEnquiry, async (req, res) => {
  try {
    const { name, email, eventType, eventDate, guestCount, budget, venue, serviceStyle, message } = req.body;

    const enquiry = await Enquiry.create({
      name,
      email,
      eventType,
      eventDate,
      guestCount,
      budget,
      venue,
      serviceStyle,
      message,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Thank you! We'll be in touch within 4 business hours.",
      data: { id: enquiry._id },
    });
  } catch (error) {
    console.error('Enquiry error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
