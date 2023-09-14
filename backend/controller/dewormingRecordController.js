const asyncHandler = require('express-async-handler');
const schema = require('../model/dewormingRecordSchema.js');

// @desc GET All/ Single StudentProfile/s
// @route router.get("/student-profile", getStudentProfile); / router.get("/student-profile/:id", getStudentProfile);
// @access Private
const getDewormingRecord = asyncHandler (async (req, res) => {   
    try {
        // ang pulos sa single get kay para pang check lang sa backend kung d mag include og search text box
        if (req.params.id) {
            const singleData = await schema.findById(req.params.id);        
            if (singleData) {
                res.send(singleData);
            } else {
                res.send({ message: "No records found" });
            }
        } else {
            const allData = await schema.find();
            if (!allData?.length) {
                res.send({ message: "No records found" });
            } else {
                res.send(allData);
            }
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

// @desc POST Single StudentProfile
// @route router.post('/student-profile', postStudentProfile);   
// @access Private
const postDewormingRecord = asyncHandler (async (req, res) => {
    const { 
        dewo_male4p, 
        dewo_female4p,
        dewo_maleNon4p,
        dewo_femaleNon4p,
        dewo_total,
        dewo_type,
        class_id,
} = req.body;
    // DATA CONFIRMATION
    if(!dewo_male4p || !dewo_female4p || !dewo_maleNon4p || !dewo_femaleNon4p || !dewo_total || !dewo_type || !class_id) {
        return res.status(400).json({ message: 'all fields are required' });
    };
    // check for duplicate
    const duplicateRecord = await schema.findOne({ class_id: class_id }).lean().exec();
    if(duplicateRecord) {
        return res.status(400).json({ message: 'Record already exists' });
    };
    const object = { 
        dewo_male4p, 
        dewo_female4p,
        dewo_maleNon4p,
        dewo_femaleNon4p,
        dewo_total,
        dewo_type,
        class_id }
    // create and store new Student Profile
    const newData = await schema.create(object);
    // StudentProfile created
    if (newData) {
        res.status(201).json({ message: `Record Created` });
    } else {
        res.status(400).json({ message: 'Failed to create record' });
    };
});

// @desc Update Single StudentProfile
// @route router.patch("/student-profile/", updateStudentProfile);
// @access Private
const updateDewormingRecord = asyncHandler (async (req, res) => {
    try {
        const { 
            dewo_male4p, 
            dewo_female4p,
            dewo_maleNon4p,
            dewo_femaleNon4p,
            dewo_total,
            dewo_type,
            class_id } = req.body;
        
        // check if Student LRN of the current StudentProfile exists
        const oldData = await schema.findOne({class_id: class_id}).exec();
        if (!oldData) {
            res.status(400).json({ message: 'Record not found' });
        };
        oldData.dewo_male4p = dewo_male4p;
        oldData.dewo_female4p = dewo_female4p;
        oldData.dewo_maleNon4p = dewo_maleNon4p;
        oldData.dewo_femaleNon4p = dewo_femaleNon4p;
        oldData.dewo_total = dewo_total;
        oldData.dewo_type = dewo_type;
        oldData.class_id = class_id;
        const updatedData = await oldData.save();
        res.json({ message: `${updatedData.class_id} Record Updated` });
    } catch (error) {
        console.error('Error in updating record', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// @desc Delete Single StudentProfile
// @route router.patch("/student-profile/:id", deleteStudentProfile);
// @access Private
const deleteDewormingRecord = asyncHandler (async (req, res) => {
    try {
        const { id } = req.params;
        
        // check if Student LRN of the current StudentProfile exists
        const oldData = await schema.findById(id).exec();
        if (!oldData) {
            res.status(400).json({ message: 'Record not found' });
        };
        oldData.stud_status = "DELETED";
        const updatedData = await oldData.save();
        res.json({ message: `${updatedData.class_id} Record Deleted` });
    } catch (error) {
        console.error('Error in deleting record', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = { 
    getDewormingRecord, 
    postDewormingRecord,   
    updateDewormingRecord,
    deleteDewormingRecord 
};