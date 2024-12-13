// userModels.js
const mongoose = require("mongoose");

const AdminAuthanticationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure unique email addresses
    },
    mobile: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    is_admin: {
        type: Number,
        required: true,
        default: 1, // Set to 1 to indicate an admin role
    },
    is_verified: {
        type: Number,
        default: 0,
    },
    token: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        default: 'Admin', // Set the role to "admin" by default
    }
});

module.exports = mongoose.model('AdminAuthantication', AdminAuthanticationSchema);
