const mongoose = require("mongoose")

const dewormingRecordSchema = new mongoose.Schema({
    dewo_male4p: {
        type: Number,
        unique: true,
        required: true,
    },
    dewo_female4p: {
        type: Number,
        required: true,
    },
    dewo_maleNon4p: {
        type: Number,
        required: true,
    },
    dewo_femaleNon4p: {
        type: Number,
        required: true,
    },
    dewo_total: {
        type: Number,
        required: true,
    },
    dewo_type: {
        type: String,
        required: true,
    },
    class_id: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("deworming_record", dewormingRecordSchema)