const mongoose = require("mongoose")

const facultyProfileSchema = new mongoose.Schema({ 
    facl_employeeId: {
        type: String,
        unique: true,
        required: true,
    },
    facl_lastName: {
        type: String,
        required: true,
    },
    facl_firstName: {
        type: String,
        required: true,
    },
    facl_middleName: {
        type: String,
        required: true,
    },
    facl_gender: {
        type: String,
        required: true,
    },
    facl_mobileNumber: {
        type: Number,
        required: true,
    },
    facl_role: {
        type: String,
        required: true,
    },
    facl_status: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("faculty_profile", facultyProfileSchema)