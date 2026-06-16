const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const Invoice = require('../../models/Invoice');
const Order = require('../../models/Order');
const { sendInvoiceEmail } = require('../../services/emailService');
const MenuConfig = require('../../models/MenuConfig');

// GET /api/admin/invoices
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, orderId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (orderId) filter.orderId = orderId;

    const total = await Invoice.countDocuments(filter);
    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ success: true, data: invoices, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/admin/invoices/:id
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/admin/invoices — create (optionally from an order)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { orderId, client, serviceDescription, lineItems, vatRate, paymentMethod, stripePaymentLink, issueDate, dueDate, notes } = req.body;

    const invoice = new Invoice({
      orderId: orderId || undefined,
      client,
      serviceDescription,
      lineItems: lineItems || [],
      vatRate: vatRate ?? 20,
      paymentMethod: paymentMethod || 'none',
      stripePaymentLink,
      issueDate: issueDate || new Date(),
      dueDate: dueDate || undefined,
      notes,
    });

    await invoice.save();
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    console.error('Invoice create error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// PUT /api/admin/invoices/:id
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { client, serviceDescription, lineItems, vatRate, paymentMethod, stripePaymentLink, issueDate, dueDate, notes, status } = req.body;

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    if (client) invoice.client = client;
    if (serviceDescription !== undefined) invoice.serviceDescription = serviceDescription;
    if (lineItems) invoice.lineItems = lineItems;
    if (vatRate !== undefined) invoice.vatRate = vatRate;
    if (paymentMethod) invoice.paymentMethod = paymentMethod;
    if (stripePaymentLink !== undefined) invoice.stripePaymentLink = stripePaymentLink;
    if (issueDate) invoice.issueDate = issueDate;
    if (dueDate !== undefined) invoice.dueDate = dueDate || undefined;
    if (notes !== undefined) invoice.notes = notes;
    if (status) invoice.status = status;

    await invoice.save();
    res.json({ success: true, data: invoice });
  } catch (err) {
    console.error('Invoice update error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// DELETE /api/admin/invoices/:id  (drafts only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    if (invoice.status !== 'draft') return res.status(400).json({ success: false, message: 'Only draft invoices can be deleted.' });
    await invoice.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/admin/invoices/:id/send-email
router.post('/:id/send-email', adminAuth, async (req, res) => {
  try {
    const { pdfBase64 } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    const settingsDoc = await MenuConfig.findOne({ key: 'payment-settings' });
    const company = settingsDoc?.data?.companyDetails || {};

    await sendInvoiceEmail({
      clientName: invoice.client.name,
      clientEmail: invoice.client.email,
      invoiceNumber: invoice.invoiceNumber,
      pdfBase64,
      companyName: company.name || 'Sizzling Sensations',
      companyEmail: company.email,
    });

    invoice.status = invoice.status === 'draft' ? 'sent' : invoice.status;
    await invoice.save();

    res.json({ success: true, message: `Invoice sent to ${invoice.client.email}` });
  } catch (err) {
    console.error('Send invoice email error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to send email.' });
  }
});

module.exports = router;
