const mongoose = require("mongoose");

const TeamsSchema = new mongoose.Schema({
  teams: {
    type: String,
    required: true,
  },
  DepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Departments"
  },
  BusinessUnitId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "BusinessUnits"
  },
  accessTabs: {
    type: [String],  // Define accessTabs as an array of strings
    default: []
  }
});

module.exports = mongoose.model("Teams", TeamsSchema);
