const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  Location: {
    type: String,
    required: true,
  },
  
  
});

module.exports = mongoose.model("Locations", LocationSchema);
