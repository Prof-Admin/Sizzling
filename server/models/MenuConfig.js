const mongoose = require('mongoose');

const menuConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuConfig', menuConfigSchema);
