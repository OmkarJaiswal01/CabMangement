const mongoose = require('mongoose');

const PostNameSchema = new mongoose.Schema({
  BusinessUnitId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "BusinessUnits"
  },
  DepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Departments"
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Teams"
  },
  LocationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Locations"
  },
  postName: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },


  NoOfJob: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  descriptions: {
    type: String,
    required: true,
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddUser",  // Reference to the Admin model (or whichever model represents the user)
    required: true
  },


  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PostName", PostNameSchema);
