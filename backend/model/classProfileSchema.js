const mongoose = require("mongoose")

const facultyProfileSchema = new mongoose.Schema({ 
    class_grade: {
        type: String,
        required: true,
    },
    class_section: {
        type: String,
        required: true,
    },
    class_room: {
        type: String,
        required: true,
    }, 
    class_syFrom: {
        type: String,
        required: true,
    },
    class_syTo: {
        type: String,
        required: true,
    },
    class_status: {
        type: String,
        required: true,
    },
    facl_employeeId: { 
        type: String,
        required: true, 
    },
}, { timestamps: true });

module.exports = mongoose.model("class_profile", facultyProfileSchema)