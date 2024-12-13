const mongoose = require("mongoose");

const AddUserModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique email addresses
  },
  phone: {
    type: String,
    required: true,
  },
  Currentaddress: {
    type: String,
    required: true,
  },
  PermanentAddress: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cabService:{
    type: String,
    default: "none",
  },
  TeamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Teams",
  },
  role: {
    type: String,
    required: true, // Ensure role is required
  },
});

module.exports = mongoose.model("AddUser", AddUserModelSchema);
