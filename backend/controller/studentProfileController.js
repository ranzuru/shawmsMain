const asyncHandler = require('express-async-handler');
const studentProfileSchema = require('../model/studentProfileSchema.js');

// @desc GET All/ Single StudentProfile/s
// @route Retrieve/ GET StudentProfile/s
// @access Private
const getStudentProfile = asyncHandler (async (req, res) => {   
    try {
        // ang pulos sa single get kay para pang check lang sa backend kung d mag include og search text box
        if (req.params.id) {
            const singleStudentProfile = await studentProfileSchema.findById(req.params.id);        
            if (singleStudentProfile) {
                res.send(singleStudentProfile);
            } else {
                res.send({ message: "No student profile found" });
            }
        } else {
            const allStudentProfile = await studentProfileSchema.find({ stud_status: { $ne: 'DELETED' } });
            if (!allStudentProfile?.length) {
                res.send({ message: "No student profiles found" });
            } else {
                res.send(allStudentProfile);
            }
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

// @desc POST Single StudentProfile
// @route Create/ POST StudentProfile 
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
        stud_status } = req.body;
    const booleanConvert4P = stud_4p === 'true';
    // DATA CONFIRMATION
    if(!stud_lrn || !stud_lastName || !stud_firstName || !stud_middleName || !stud_gender || !stud_birthDate || !stud_age || typeof booleanConvert4P !== 'boolean' || !stud_parentName1 || !stud_parentMobile1 || !stud_address || !stud_status) {
        return res.status(400).json({ message: 'all fields are required' });
    };
    // check for duplicate
    const duplicateLrn = await studentProfileSchema.findOne({ stud_lrn: stud_lrn }).lean().exec();
    if(duplicateLrn) {
        return res.status(400).json({ message: 'Student LRN already exists' });
    };
    const studentProfileObject = { 
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
        stud_status }
    // create and store new Student Profile
    const newStudentProfile = await studentProfileSchema.create(studentProfileObject);
    // StudentProfile created
    if (newStudentProfile) {
        res.status(201).json({ message: `Created Student Profile (LRN - Last Name): ${stud_lrn} - ${stud_lastName}` });
    } else {
        res.status(400).json({ message: 'Failed to create Student Profile' });
    };
});

// @desc Update Single StudentProfile
// @route Update/ PATCH Single StudentProfile
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
        const createdStudentProfile = await studentProfileSchema.findOne({stud_lrn: stud_lrn}).exec();
        if (!createdStudentProfile) {
            res.status(400).json({ message: 'Student Profile not found' });
        };
        createdStudentProfile.stud_lrn = stud_lrn;
        createdStudentProfile.stud_lastName = stud_lastName;
        createdStudentProfile.stud_firstName = stud_firstName;
        createdStudentProfile.stud_middleName = stud_middleName;
        createdStudentProfile.stud_gender = stud_gender;
        createdStudentProfile.stud_birthDate = stud_birthDate;
        createdStudentProfile.stud_age = stud_age;
        createdStudentProfile.stud_4p = stud_4p;
        createdStudentProfile.stud_parentName1 = stud_parentName1;
        createdStudentProfile.stud_parentMobile1 = stud_parentMobile1;
        createdStudentProfile.stud_parentName2 = stud_parentName2;
        createdStudentProfile.stud_parentMobile2 = stud_parentMobile2;
        createdStudentProfile.stud_address = stud_address;
        createdStudentProfile.stud_status = stud_status;
        const updatedStudentProfile = await createdStudentProfile.save();
        res.json({ message: `Student Profile ${updatedStudentProfile.stud_lrn} updated` });
    } catch (error) {
        console.error('Error in updateStudentProfile:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// @desc Delete Single StudentProfile
// @route Delete Single StudentProfile
// @access Private
const deleteStudentProfile = asyncHandler (async (req, res) => {
    try {
        const { id } = req.params;
        
        // check if Student LRN of the current StudentProfile exists
        const createdStudentProfile = await studentProfileSchema.findById(id).exec();
        if (!createdStudentProfile) {
            res.status(400).json({ message: 'Student Profile not found' });
        };
        createdStudentProfile.stud_status = "DELETED";
        const updatedStudentProfile = await createdStudentProfile.save();
        res.json({ message: `Student Profile ${updatedStudentProfile.id} deleted` });
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