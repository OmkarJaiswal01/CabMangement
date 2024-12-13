const mongoose = require("mongoose");

const BusinessUnitSchema = new mongoose.Schema({
  BusinessUnit: {
    type: String,
    required: true,
  },
  
});

module.exports = mongoose.model("BusinessUnits", BusinessUnitSchema);
