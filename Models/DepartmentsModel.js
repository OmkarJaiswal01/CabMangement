const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  Department: {
    type: String,
    required: true,
  },
  BusinessUnitId: { // Ensure consistency in naming (e.g., `teamId` instead of `TeamId`)
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId if referencing another document
    required: true,
    ref: "BusinessUnits" // Reference to the Teams collection
},
  
});

module.exports = mongoose.model("Departments", DepartmentSchema);
