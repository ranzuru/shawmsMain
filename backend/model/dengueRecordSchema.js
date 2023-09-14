const mongoose = require("mongoose")

const dengueRecordSchema = new mongoose.Schema({ 
    deng_onsetDate: {
        type: String,
        required: true,
    },
    deng_admissionDate: {
        type: String,
        required: false,
    },
    deng_admissionHospital: {
        type: String,
        required: true,
    },
    deng_dischargeDate: {
        type: String,
        required: false,
    },
    stud_id: {
        type: String,
        required: true,
    },
    class_id: {
        type: String,
        required: true,
    },
    facl_id: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("dengue_record", dengueRecordSchema)