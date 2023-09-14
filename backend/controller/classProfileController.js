const asyncHandler = require('express-async-handler');
const ClassProfileSchema = require('../model/classProfileSchema.js');

// @desc GET All/ Single Faculty Profile/s
// @route Retrieve/ GET Faculty Profile/s
// @access Private
const getClassProfile = asyncHandler (async (req, res) => {   
    try {
        if (req.params.id) {
            const singleData = await ClassProfileSchema.findById(req.params.id);        
            if (singleData) {
                res.send(singleData);
            } else {
                res.send({ message: "No class profile found" });
            }
        } else {
            const allData = await ClassProfileSchema.find();
            if (!allData?.length) {
                res.send({ message: "No class profiles found" });
            } else {
                res.send(allData);
            }
        }
        
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

// @desc POST Single Faculty Profile
// @route Create/ POST Faculty Profile 
// @access Private
const postClassProfile = asyncHandler (async (req, res) => {
    const { 
        class_grade, 
        class_section, 
        class_room,
        class_syFrom,
        class_syTo,
        facl_employeeId,
        stud_id } = req.body;
    // DATA CONFIRMATION
    if(!class_grade || !class_section || !class_room || !class_syFrom || !class_syTo || !facl_employeeId ) {
        return res.status(400).json({ message: 'all fields are required' });
    };
    const object = { 
        class_grade, 
        class_section, 
        class_room,
        class_syFrom,
        class_syTo,
        class_status: 'Active',
        facl_employeeId,
        stud_id };
    // create and store new Faculty Profile
    const newData = await ClassProfileSchema.create(object);
    // FacultyProfile created
    if (newData) {
        res.status(201).json({ message: `Faculty Profile Created!` });
    } else {
        res.status(400).json({ message: 'failed to create Faculty Profile' });
    };
});

// @desc Update Single FacultyProfile
// @route Update/ PATCH Single FacultyProfile
// @access Private
const updateClassProfile = asyncHandler (async (req, res) => {
    try {
    const { 
        id, 
        class_grade, 
        class_section, 
        class_room,
        class_syFrom,
        class_syTo,
        facl_employeeId } = req.body;
        // check if Faculty LRN of the current FacultyProfile exists
        const createdData = await ClassProfileSchema.findById(id).exec();
        if (!createdData) {
            res.status(400).json({ message: 'class Profile not found' });
        };
        createdData.class_grade = class_grade;
        createdData.class_section = class_section;
        createdData.class_room = class_room;
        createdData.class_syFrom = class_syFrom;
        createdData.class_syTo = class_syTo;
        createdData.facl_employeeId = facl_employeeId;
        const updatedData = await createdData.save();
        res.json({ message: `Faculty Profile ${updatedData.class_section} updated` });
    } catch (error) {
        console.error('Error in updateStudentProfile:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = { 
    getClassProfile, 
    postClassProfile,   
    updateClassProfile
};