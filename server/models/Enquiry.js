const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: [
        'Wedding',
        'Corporate Event',
        'Birthday Party',
        'Private Dining',
        'Brand Launch',
        'Gala Dinner',
        'Other',
      ],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
      max: [5000, 'Guest count cannot exceed 5000'],
    },
    budget: {
      type: String,
      enum: [
        'Under £500',
        '£500 - £1,000',
        '£1,000 - £2,500',
        '£2,500 - £5,000',
        '£5,000 - £10,000',
        'Over £10,000',
        'To be discussed',
      ],
    },
    venue: {
      type: String,
      trim: true,
      maxlength: [200, 'Venue cannot exceed 200 characters'],
    },
    serviceStyle: {
      type: String,
      enum: [
        'Full-Service Catering',
        'Grazing Table',
        'Platter Delivery',
        'Buffet',
        'Fine Dining / Plated',
        'Not sure yet',
      ],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'confirmed', 'declined'],
      default: 'new',
    },
    ipAddress: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
