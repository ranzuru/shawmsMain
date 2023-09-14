const asyncHandler = require('express-async-handler');
const schema = require('../model/studentProfileSchema.js');

// @desc GET All/ Single StudentProfile/s
// @route router.get("/student-profile", getStudentProfile); / router.get("/student-profile/:id", getStudentProfile);
// @access Private
const getStudentProfile = asyncHandler (async (req, res) => {   
    try {
        // ang pulos sa single get kay para pang check lang sa backend kung d mag include og search text box
        if (req.params.id) {
            const singleData = await schema.findById(req.params.id);        
            if (singleData) {
                res.send(singleData);
            } else {
                res.send({ message: "No student profile found" });
            }
        } else {
            const allData = await schema.find({ stud_status: { $ne: 'DELETED' } });
            if (!allData?.length) {
                res.send({ message: "No student profiles found" });
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
const postStudentProfile = asyncHandler (async (req, res) => {
    const { 
        stud_lrn, 
        stud_lastName,
        stud_firstName,
        stud_middleName,
        stud_gender,
        stud_birthDate,
        stud_age,
        stud_4p,
        stud_parentName1,
        stud_parentMobile1, 
        stud_parentName2,
        stud_parentMobile2, 
        stud_address,
        stud_status,
        class_id } = req.body;
    const booleanConvert4P = stud_4p === 'true';
    // DATA CONFIRMATION
    if(!stud_lrn || !stud_lastName || !stud_firstName || !stud_middleName || !stud_gender || !stud_birthDate || !stud_age || typeof booleanConvert4P !== 'boolean' || !stud_parentName1 || !stud_parentMobile1 || !stud_address || !stud_status || !class_id) {
        return res.status(400).json({ message: 'all fields are required' });
    };
    // check for duplicate
    const duplicateLrn = await schema.findOne({ stud_lrn: stud_lrn }).lean().exec();
    if(duplicateLrn) {
        return res.status(400).json({ message: 'Student LRN already exists' });
    };
    const object = { 
        stud_lrn, 
        stud_lastName,
        stud_firstName,
        stud_middleName,
        stud_gender,
        stud_birthDate,
        stud_age,
        stud_4p,
        stud_parentName1,
        stud_parentMobile1, 
        stud_parentName2,
        stud_parentMobile2, 
        stud_address, 
        stud_status,
        class_id }
    // create and store new Student Profile
    const newData = await schema.create(object);
    // StudentProfile created
    if (newData) {
        res.status(201).json({ message: `Created Student Profile (LRN - Last Name): ${stud_lrn} - ${stud_lastName}` });
    } else {
        res.status(400).json({ message: 'Failed to create Student Profile' });
    };
});

// @desc Update Single StudentProfile
// @route router.patch("/student-profile/", updateStudentProfile);
// @access Private
const updateStudentProfile = asyncHandler (async (req, res) => {
    try {
        const { 
            stud_lrn, 
            stud_lastName,
            stud_firstName,
            stud_middleName,
            stud_gender,
            stud_birthDate,
            stud_age,
            stud_4p,
            stud_parentName1,
            stud_parentMobile1, 
            stud_parentName2,
            stud_parentMobile2, 
            stud_address,  
            stud_status } = req.body;
        
        // check if Student LRN of the current StudentProfile exists
        const oldData = await schema.findOne({stud_lrn: stud_lrn}).exec();
        if (!oldData) {
            res.status(400).json({ message: 'Student Profile not found' });
        };
        oldData.stud_lrn = stud_lrn;
        oldData.stud_lastName = stud_lastName;
        oldData.stud_firstName = stud_firstName;
        oldData.stud_middleName = stud_middleName;
        oldData.stud_gender = stud_gender;
        oldData.stud_birthDate = stud_birthDate;
        oldData.stud_age = stud_age;
        oldData.stud_4p = stud_4p;
        oldData.stud_parentName1 = stud_parentName1;
        oldData.stud_parentMobile1 = stud_parentMobile1;
        oldData.stud_parentName2 = stud_parentName2;
        oldData.stud_parentMobile2 = stud_parentMobile2;
        oldData.stud_address = stud_address;
        oldData.stud_status = stud_status;
        const updatedData = await oldData.save();
        res.json({ message: `Student Profile ${updatedData.stud_lrn} updated` });
    } catch (error) {
        console.error('Error in updateStudentProfile:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// @desc Delete Single StudentProfile
// @route router.patch("/student-profile/:id", deleteStudentProfile);
// @access Private
const deleteStudentProfile = asyncHandler (async (req, res) => {
    try {
        const { id } = req.params;
        
        // check if Student LRN of the current StudentProfile exists
        const oldData = await schema.findById(id).exec();
        if (!oldData) {
            res.status(400).json({ message: 'Student Profile not found' });
        };
        oldData.stud_status = "DELETED";
        const updatedData = await oldData.save();
        res.json({ message: `Student Profile ${updatedData.id} deleted` });
    } catch (error) {
        console.error('Error in deleteStudentProfile:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = { 
    getStudentProfile, 
    postStudentProfile,   
    updateStudentProfile,
    deleteStudentProfile 
};