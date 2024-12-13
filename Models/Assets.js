const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema(
  {
    DriverName: {
      type: String,
      required: true,
    },
    cabNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Assets = mongoose.model('Assets', AssetSchema);

module.exports = Assets;
