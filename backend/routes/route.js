const router = require('express').Router();

const { 
    allowUserApproval, 
    denyUserApproval, 
    postUserLogin,
    postUserRegistration,
    getUserAuthentication,
    getUserLogout,
    getAllApprovedUser,
    getAllApprovalNeededUser, 
    updateUser, 
    deleteUser} = require('../controller/userProfileController.js');
const { 
    getStudentProfile, 
    postStudentProfile, 
    updateStudentProfile, 
    deleteStudentProfile } = require('../controller/studentProfileController.js');
const { 
    getFacultyProfile, 
    postFacultyProfile, 
    updateFacultyProfile, 
    deleteFacultyProfile } = require('../controller/facultyProfileController.js');
const { 
    getClassProfile, 
    postClassProfile,  
    updateClassProfile } = require('../controller/classProfileController.js');
const {
    getDengueRecord,
    postDengueRecord,
    updateDengueRecord,
    deleteDengueRecord } = require('../controller/dengueRecordController.js');
const {
    getDewormingRecord,
    postDewormingRecord,
    updateDewormingRecord,
    deleteDewormingRecord } = require('../controller/dewormingRecordController.js');
const {
    getNutritionalStatusRecord, 
    postNutritionalStatusRecord,   
    updateNutritionalStatusRecord,
    deleteNutritionalStatusRecord } = require('../controller/nutritionalStatusRecordController.js');

// ------------------------------ ADMIN/ USER ROUTES

router.patch('/user-approval/:id', allowUserApproval);
router.delete('/user-approval/:id', denyUserApproval);
router.get("/user-approval", getAllApprovalNeededUser);
router.post('/login', postUserLogin);
router.post('/registration', postUserRegistration);
// Retrieve/ GET User (Login)
router.get('/protected', getUserAuthentication, (req, res) => {
    // The authenticateMiddleware ensures only authenticated users can access this route
    res.json({ message: 'Access granted to protected route', user: req.user });
});
router.get("/user-profile", getAllApprovedUser);
router.patch("/user-profile/:id", updateUser);
router.patch("/user-profile/:id", deleteUser);

// ------------------------------ STUDENT PROFILE ROUTES
router.get("/student-profile", getStudentProfile);             
router.get("/student-profile/:id", getStudentProfile);         
router.post('/student-profile', postStudentProfile);           
router.patch("/student-profile/", updateStudentProfile);    
router.patch("/student-profile/:id", deleteStudentProfile);

// ------------------------------ CLASS PROFILE ROUTES
router.get("/class-profile", getClassProfile);              
router.get("/class-profile/:id", getClassProfile);         
router.post('/class-profile', postClassProfile);            
router.patch("/class-profile/", updateClassProfile);      

// ------------------------------ FACULTY PROFILE ROUTES
router.get("/faculty-profile", getFacultyProfile);             
router.get("/faculty-profile/:id", getFacultyProfile);         
router.post('/faculty-profile', postFacultyProfile);           
router.patch("/faculty-profile/", updateFacultyProfile);    
router.patch("/faculty-profile/:id", deleteFacultyProfile); 

// ------------------------------ CLINIC PROGRAM PROFILE ROUTES
router.get("/program-profile", getFacultyProfile);             
router.get("/program-profile/:id", getFacultyProfile);         
router.post('/program-profile', postFacultyProfile);           
router.patch("/program-profile/", updateFacultyProfile);    
router.patch("/program-profile/:id", deleteFacultyProfile);  

// ------------------------------ DENGUE MONITORING ROUTES
router.get("/dengue-monitoring", getDengueRecord);             
router.get("/dengue-monitoring/:id", getDengueRecord);         
router.post('/dengue-monitoring', postDengueRecord);           
router.patch("/dengue-monitoring/", updateDengueRecord);    
router.patch("/dengue-monitoring/:id", deleteDengueRecord);

// ------------------------------ IMMUNIZATION ROUTES
router.get("/immunization", getStudentProfile);             
router.get("/immunization/:id", getStudentProfile);         
router.post('/immunization', postStudentProfile);           
router.patch("/immunization/", updateStudentProfile);    
router.patch("/immunization/:id", deleteStudentProfile);

// ------------------------------ MEDICAL CHECKUP ROUTES


// ------------------------------ FACULTY CHECKUP ROUTES


// ------------------------------ DE-WORMING MONITORING ROUTES
router.get("/deworming-monitoring", getDewormingRecord);             
router.get("/deworming-monitoring/:id", getDewormingRecord);         
router.post('/deworming-monitoring', postDewormingRecord);           
router.patch("/deworming-monitoring/", updateDewormingRecord);    
router.patch("/deworming-monitoring/:id", deleteDewormingRecord);

// ------------------------------ FEEDING PROGRAM ROUTES


// ------------------------------ NUTRITIONAL STATUS ROUTES
router.get("/nutritional-status", getNutritionalStatusRecord);             
router.get("/nutritional-status/:id", getNutritionalStatusRecord);         
router.post('/nutritional-status', postNutritionalStatusRecord);           
router.patch("/nutritional-status/", updateNutritionalStatusRecord);    
router.patch("/nutritional-status/:id", deleteNutritionalStatusRecord);

// ------------------------------ CLINIC RECORDS ROUTES


// ------------------------------ MEDICINE INVENTORY ROUTES


// ------------------------------ LOGS ROUTES


module.exports = router;