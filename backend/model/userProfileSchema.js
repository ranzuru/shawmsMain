const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    user_lastName: {
        type: String,
        required: true,
    },
    user_mobileNumber: {
        type: Number,
        required: true,
    },
    user_email: {
        type: String,
        unique: true,
        required: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    user_gender: { 
        type: String, 
        required: true 
    },
    user_role: {
        type: String,
        required: true 
    },
    user_status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    user_approved: { 
        type: Boolean, 
        default: false },
}, { timestamps: true });

module.exports = mongoose.model("user_profile", userSchema)