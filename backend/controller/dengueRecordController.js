const asyncHandler = require('express-async-handler');
const schema = require('../model/dengueRecordSchema.js');

// @desc GET All/ Single StudentProfile/s
// @route router.get("/student-profile", getStudentProfile); / router.get("/student-profile/:id", getStudentProfile);
// @access Private
const getDengueRecord = asyncHandler (async (req, res) => {   
    try {
        // ang pulos sa single get kay para pang check lang sa backend kung d mag include og search text box
        if (req.params.id) {
            const singleData = await schema.findById(req.params.id);        
            if (singleData) {
                res.send(singleData);
            } else {
                res.send({ message: "No record found" });
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
const postDengueRecord = asyncHandler (async (req, res) => {
    const { 
        deng_onsetDate, 
        deng_admissionDate,
        deng_admissionHospital,
        deng_dischargeDate,
        stud_id,
        class_id,
        facl_id } = req.body;
    // DATA CONFIRMATION
    if(!deng_onsetDate || !deng_admissionDate || !deng_admissionHospital || !deng_dischargeDate || !stud_id || !class_id ||!facl_id ) {
        return res.status(400).json({ message: 'all fields are required' });
    };

    const object = { 
        deng_onsetDate, 
        deng_admissionDate,
        deng_admissionHospital,
        deng_dischargeDate,
        stud_id,
        class_id,
        facl_id }
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
const updateDengueRecord = asyncHandler (async (req, res) => {
    try {
        const { 
            deng_onsetDate, 
            deng_admissionDate,
            deng_admissionHospital,
            deng_dischargeDate,
            stud_id,
            class_id,
            facl_id } = req.body;
        // check if Student LRN of the current StudentProfile exists
        const oldData = await schema.findById(req.params.id).exec();
        if (!oldData) {
            res.status(400).json({ message: 'Record not found' });
        };
        oldData.deng_onsetDate = deng_onsetDate;
        oldData.deng_admissionDate = deng_admissionDate;
        oldData.deng_admissionHospital = deng_admissionHospital;
        oldData.deng_dischargeDate = deng_dischargeDate;
        oldData.stud_id = stud_id;
        oldData.class_id = class_id;
        oldData.facl_id = facl_id;

        const updatedData = await oldData.save();
        res.json({ message: `Record Updated: ${updatedData.id}` });
    } catch (error) {
        console.error('Error in updating record', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// @desc Delete Single StudentProfile
// @route router.patch("/student-profile/:id", deleteStudentProfile);
// @access Private
const deleteDengueRecord = asyncHandler (async (req, res) => {
    try {
        // check if Student LRN of the current StudentProfile exists
        const oldData = await schema.findById(req.params.id).exec();
        if (!oldData) {
            res.status(400).json({ message: 'Record not found' });
        };
        oldData.stud_status = "DELETED";
        const updatedData = await oldData.save();
        res.json({ message: `Record Deleted: ${updatedData.id}` });
    } catch (error) {
        console.error('Error in deleting record', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = { 
    getDengueRecord, 
    postDengueRecord,   
    updateDengueRecord,
    deleteDengueRecord 
};