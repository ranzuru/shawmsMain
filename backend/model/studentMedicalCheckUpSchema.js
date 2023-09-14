const mongoose = require("mongoose")

const nutritionalStatusSchema = new mongoose.Schema({ 
    stmc_examinationDate: {
        type: Number,
        required: true,
    },
    stmc_tempBp: {
        type: Number,
        required: true,
    },
    stmc_hrPrRr: {
        type: Number,
        required: true,
    }, 
    stmc_height: {
        type: Number,
        required: true,
    },
    stmc_nsBmiWfa: {
        type: String,
        required: true,
    },
    stmc_nsHfa: {
        type: String,
        required: true,
    },
    stmc_visScrn: {
        type: String,
        required: true,
    },
    stmc_: {
        type: String,
        required: true,
    },
    stmc_nsHfa: {
        type: String,
        required: true,
    },
    stmc_nsHfa: {
        type: String,
        required: true,
    },
    stmc_nsHfa: {
        type: String,
        required: true,
    },
    nutr_remarks: { 
        type: String,
        required: true, 
    },
    nutr_type: { 
        type: String,
        required: true, 
    },
    stud_id: { 
        type: String,
        required: true, 
    },
    class_id: { 
        type: String,
        required: true, 
    },
}, { timestamps: true });

module.exports = mongoose.model("student_medicalCheckUp_record", nutritionalStatusSchema)