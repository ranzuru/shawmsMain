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


// ------------------------------ ADMIN/ USER ROUTES

// Update/ PATCH User Approval (ALLOW)
router.patch('/user-approval/:id', allowUserApproval);

// Delete/ DELETE User Approval (DENY)
router.delete('/user-approval/:id', denyUserApproval);

// Create/ POST User (Login)
router.post('/login', postUserLogin);

// Create/ POST Single User (Registration)
router.post('/registration', postUserRegistration);

// Retrieve/ GET User (Login)
router.get('/protected', getUserAuthentication, (req, res) => {
    // The authenticateMiddleware ensures only authenticated users can access this route
    res.json({ message: 'Access granted to protected route', user: req.user });
});

// Retrieve/ GET All Approved Users
router.get("/user-profile", getAllApprovedUser);

// Retrieve/ GET All Approval Needed Users
router.get("/user-approval", getAllApprovalNeededUser);

// ------------------------------ STUDENT PROFILE ROUTES
router.get("/student-profile", getStudentProfile);             
router.get("/student-profile/:id", getStudentProfile);         
router.post('/student-profile', postStudentProfile);           
router.patch("/student-profile/:id", updateStudentProfile);    
router.delete("/student-profile/:id", deleteStudentProfile);    

// ------------------------------ FACULTY PROFILE ROUTES
router.get("/faculty-profile", getFacultyProfile);             
router.get("/faculty-profile/:id", getFacultyProfile);         
router.post('/faculty-profile', postFacultyProfile);           
router.patch("/faculty-profile/:id", updateFacultyProfile);    
router.delete("/faculty-profile/:id", deleteFacultyProfile);   

module.exports = router;