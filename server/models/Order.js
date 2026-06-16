const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: true,
      enum: ['grazing', 'platter', 'full-service'],
    },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'new',
    },
    contact: {
      name:  { type: String, required: true, trim: true, maxlength: 100 },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    estimatedTotal: { type: Number, required: true, min: 0 },
    orderData: { type: mongoose.Schema.Types.Mixed },
    ipAddress: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
