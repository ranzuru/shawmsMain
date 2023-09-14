const mongoose = require("mongoose")

const nutritionalStatusSchema = new mongoose.Schema({ 
    nutr_weight: {
        type: Number,
        required: true,
    },
    nutr_height: {
        type: Number,
        required: true,
    },
    nutr_height2: {
        type: Number,
        required: true,
    }, 
    nutr_bmi: {
        type: Number,
        required: true,
    },
    nutr_bmiCategory: {
        type: String,
        required: true,
    },
    nutr_hfa: {
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

module.exports = mongoose.model("nutrionalStatus_record", nutritionalStatusSchema)