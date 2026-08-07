const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const Subscriber = require('../../models/Subscriber');
const { sendNewsletterEmail } = require('../../services/emailService');

const BASE_URL = process.env.API_URL || '';

// GET /api/admin/newsletter/subscribers
router.get('/subscribers', adminAuth, async (req, res) => {
  try {
    const { status = 'active', page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status !== 'all') filter.status = status;

    const total = await Subscriber.countDocuments(filter);
    const subscribers = await Subscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-token');

    res.json({ success: true, data: subscribers, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/admin/newsletter/send
router.post('/send', adminAuth, async (req, res) => {
  try {
    const { subject, contentHtml } = req.body;
    if (!subject || !contentHtml) {
      return res.status(400).json({ success: false, message: 'Subject and content are required.' });
    }

    const subscribers = await Subscriber.find({ status: 'active' });
    if (subscribers.length === 0) {
      return res.json({ success: true, message: 'No active subscribers to send to.', sent: 0 });
    }

    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      try {
        const unsubscribeUrl = `${BASE_URL}/api/newsletter/unsubscribe?token=${sub.token}`;
        await sendNewsletterEmail({ to: sub.email, subject, contentHtml, unsubscribeUrl });
        sent++;
      } catch (err) {
        console.error(`Newsletter send failed for ${sub.email}:`, err.message);
        failed++;
      }
    }

    res.json({ success: true, message: `Newsletter sent to ${sent} subscriber(s).`, sent, failed });
  } catch (err) {
    console.error('Newsletter send error:', err);
    res.status(500).json({ success: false, message: 'Failed to send newsletter.' });
  }
});

module.exports = router;
