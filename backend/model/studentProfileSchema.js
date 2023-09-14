const mongoose = require("mongoose")

const studentProfileSchema = new mongoose.Schema({
    stud_lrn: {
        type: String,
        unique: true,
        required: true,
    },
    stud_lastName: {
        type: String,
        required: true,
    },
    stud_firstName: {
        type: String,
        required: true,
    },
    stud_middleName: {
        type: String,
        required: true,
    },
    stud_gender: {
        type: String,
        required: true,
    },
    stud_birthDate: {
        type: String,
        required: true,
    },
    stud_age: {
        type: Number,
        required: true,
    },
    stud_4p: {
        type: Boolean,
        required: true,
    },
    stud_parentName1: {
        type: String,
        required: true,
    },
    stud_parentMobile1: {
        type: Number,
        required: true,
    },
    stud_parentName2: {
        type: String,
        default: 'None',
    },
    stud_parentMobile2: {
        type: String,
        default: 'None',
    },
    stud_address: {
        type: String,
        required: true,
    },
    stud_status: {
        type: String,
        required: true,
    },
    class_id: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("student_profile", studentProfileSchema)