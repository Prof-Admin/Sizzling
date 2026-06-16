const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    isExtra: { type: Boolean, default: false },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
    },
    client: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
    },
    serviceDescription: { type: String, default: '' },
    lineItems: [lineItemSchema],
    subtotal: { type: Number, default: 0 },
    vatRate: { type: Number, default: 20 },
    vatAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'stripe', 'none'],
      default: 'none',
    },
    stripePaymentLink: { type: String, default: '' },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `SS-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  this.subtotal = +this.lineItems.reduce((s, i) => s + i.total, 0).toFixed(2);
  this.vatAmount = +(this.subtotal * (this.vatRate / 100)).toFixed(2);
  this.grandTotal = +(this.subtotal + this.vatAmount).toFixed(2);
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
