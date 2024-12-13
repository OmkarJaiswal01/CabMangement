const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    vehicle: {
      type: String, // model name like hyundai Aura
      
    },
    cabNumber: {
      type: String, // registration name like UP 12 AB 5849
      required: true,
    },
    service: {
      type: String, 
      enum: ['pickup', 'drop', null],
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'expired'],
      default: 'expired',
    },
    vendorName:{
      type:String,
      required:false
    }
  },
  { timestamps: true }
);

const Rider = mongoose.model('Rider', riderSchema);

module.exports = Rider;
