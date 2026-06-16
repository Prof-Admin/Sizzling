const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Starters', 'Mains', 'Sides', 'Desserts', 'Drinks', 'Platters', 'Grazing'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    dietary: {
      type: [String],
      enum: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Dairy-Free', 'Nut-Free', 'Spicy'],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    servingSize: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
