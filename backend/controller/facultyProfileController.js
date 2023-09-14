const asyncHandler = require('express-async-handler');
const facultyProfileSchema = require('../model/facultyProfileSchema.js');

// @desc GET All/ Single Faculty Profile/s
// @route Retrieve/ GET Faculty Profile/s
// @access Private
const getFacultyProfile = asyncHandler (async (req, res) => {   
    try {
        if (req.params.id) {
            const singleFacultyProfile = await facultyProfileSchema.findById(req.params.id);        
            if (singleFacultyProfile) {
                res.send(singleFacultyProfile);
            } else {
                res.send({ message: "No faculty profile found" });
            }
        } else {
            const allFacultyProfile = await facultyProfileSchema.find();
            if (!allFacultyProfile?.length) {
                res.send({ message: "No faculty profiles found" });
            } else {
                res.send(allFacultyProfile);
            }
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

// @desc POST Single Faculty Profile
// @route Create/ POST Faculty Profile 
// @access Private
const postFacultyProfile = asyncHandler (async (req, res) => {
    const { 
        facl_employeeId, 
        facl_lastName, 
        facl_firstName,
        facl_middleName,
        facl_gender,
        facl_mobileNumber,
        facl_role,
        facl_status } = req.body;
    // DATA CONFIRMATION
    if(!facl_employeeId || !facl_mobileNumber || !facl_lastName || !facl_firstName || !facl_middleName || !facl_gender || !facl_mobileNumber || !facl_role || !facl_status) {
        return res.status(400).json({ message: 'all fields are required' });
    };
    // check for duplicate
    const duplicateEmployeeId = await facultyProfileSchema.findOne({ facl_employeeId }).lean().exec();
    if(duplicateEmployeeId) {
        return res.status(400).json({ message: 'Faculty Employee ID already exists' });
    };
    const FacultyProfileObject = { 
        facl_employeeId, 
        facl_lastName, 
        facl_firstName,
        facl_middleName,
        facl_gender,
        facl_mobileNumber,
        facl_role,
        facl_status }
    // create and store new Faculty Profile
    const newFacultyProfile = await facultyProfileSchema.create(FacultyProfileObject);
    // FacultyProfile created
    if (newFacultyProfile) {
        res.status(201).json({ message: `Faculty Profile Created!` });
    } else {
        res.status(400).json({ message: 'failed to create Faculty Profile' });
    };
});

// @desc Update Single FacultyProfile
// @route Update/ PATCH Single FacultyProfile
// @access Private
const updateFacultyProfile = asyncHandler (async (req, res) => {
    try {
    const { 
        _id, 
        facl_employeeId, 
        facl_lastName, 
        facl_firstName,
        facl_middleName,
        facl_gender,
        facl_mobileNumber,
        facl_role,
        facl_status } = req.body;
    // check if Faculty LRN of the current FacultyProfile exists
    const createdFacultyProfile = await facultyProfileSchema.findOne({facl_employeeId: facl_employeeId}).exec();
        if (!createdFacultyProfile) {
            res.status(400).json({ message: 'Faculty Profile not found' });
        };
        createdFacultyProfile.facl_employeeId = facl_employeeId;
        createdFacultyProfile.facl_lastName = facl_lastName;
        createdFacultyProfile.facl_firstName = facl_firstName;
        createdFacultyProfile.facl_middleName = facl_middleName;
        createdFacultyProfile.facl_mobileNumber = facl_mobileNumber;
        createdFacultyProfile.facl_role = facl_role;
        createdFacultyProfile.facl_gender = facl_gender;
        createdFacultyProfile.facl_status = facl_status;
        const updatedStudentProfile = await createdFacultyProfile.save();
        res.json({ message: `Faculty Profile ${updatedStudentProfile.stud_lrn} updated` });
    } catch (error) {
        console.error('Error in updateStudentProfile:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// @desc Delete Single FacultyProfile
// @route Delete Single FacultyProfile
// @access Private
const deleteFacultyProfile = asyncHandler (async (req, res) => {
    try {
        const { id } = req.params;
        
        // check if Faculty ID of the selected Faculty Profile exists
        const createdFacultyProfile = await facultyProfileSchema.findById(id).exec();
        if (!createdFacultyProfile) {
            res.status(400).json({ message: 'Faculty Profile not found' });
        };
        createdFacultyProfile.facl_status = "DELETED";
        const updatedFacultyProfile = await createdFacultyProfile.save();
        res.json({ message: `Faculty Profile ${updatedFacultyProfile.id} deleted` });
    } catch (error) {
        console.error('Error in delete Faculty Profile:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = { 
    getFacultyProfile, 
    postFacultyProfile,   
    updateFacultyProfile,
    deleteFacultyProfile 
};