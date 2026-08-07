const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const Subscriber = require('../models/Subscriber');
const { sendWelcomeSubscriberEmail } = require('../services/emailService');

const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function unsubscribeUrl(email, token) {
  const base = process.env.CLIENT_URL || 'https://sizzling-cyan.vercel.app';
  return `${process.env.API_URL || ''}/api/newsletter/unsubscribe?token=${token}`;
}

// POST /api/newsletter/subscribe
router.post('/subscribe', subscribeLimiter, [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });

  try {
    const { email } = req.body;

    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      if (subscriber.status === 'active') {
        return res.json({ success: true, message: 'You are already subscribed!' });
      }
      subscriber.status = 'active';
      await subscriber.save();
      return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
    }

    subscriber = await Subscriber.create({ email });
    res.status(201).json({ success: true, message: "You're subscribed! Welcome to Sizzling Sensations." });

    sendWelcomeSubscriberEmail(email, unsubscribeUrl(email, subscriber.token))
      .catch(err => console.error('Welcome subscriber email error:', err.message));
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/newsletter/unsubscribe?token=...
router.get('/unsubscribe', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send('<p>Invalid unsubscribe link.</p>');

    const subscriber = await Subscriber.findOne({ token });
    if (!subscriber) return res.status(404).send('<p>Subscriber not found.</p>');

    subscriber.status = 'unsubscribed';
    await subscriber.save();

    res.send(`
      <!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Unsubscribed</title></head>
      <body style="font-family:Arial,sans-serif;max-width:500px;margin:60px auto;text-align:center;color:#333;">
        <h2 style="color:#8B1A1A;">You've been unsubscribed.</h2>
        <p>You will no longer receive newsletter emails from Sizzling Sensations.</p>
        <a href="${process.env.CLIENT_URL || 'https://sizzling-cyan.vercel.app'}" style="color:#8B1A1A;">Return to website</a>
      </body></html>
    `);
  } catch (err) {
    console.error('Unsubscribe error:', err);
    res.status(500).send('<p>Something went wrong. Please try again.</p>');
  }
});

module.exports = router;
