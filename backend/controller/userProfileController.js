const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const userProfileSchema = require('../model/userProfileSchema.js');

// ----------------------------------- USER APPROVAL

// @desc DENY user profile approval
// @route Update/ PATCH User Approval (ALLOW)
// @access Private
const allowUserApproval = asyncHandler (async (req, res) => {
    try {
        const userId = req.params.id;
        // Find the user by ID and update the 'approved' field
        const allowedApproval = await userProfileSchema.findByIdAndUpdate(userId, { user_approved: true }, { new: true });

        if (!allowedApproval) {
            // User with the provided ID was not found
            return res.status(404).json({ error: 'User not found' });
        }
        // Send the updated user as a JSON response
        res.status(200).json(allowedApproval);
    } catch (error) {
        console.error('User Approval Error:', error);
        res.status(500).json({ error: 'ERROR', details: error.message });
      } 
});

// @desc DENY user profile approval
// @route Delete/ DELETE User Approval (DENY)
// @access Private
const denyUserApproval = asyncHandler (async (req, res) => {
    try {
        const userId = req.params.id;
        // Find the user by ID and update the 'approved' field
        const deniedApproval = await userProfileSchema.findByIdAndDelete(userId);

        if (!deniedApproval) {
            // User with the provided ID was not found
            return res.status(404).json({ error: 'User not found' });
        }
        // Send a success message as a JSON response
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('User Approval Error: ', error);
        res.status(500).json({ error: 'ERROR', details: error.message });
      } 
});

// ----------------------------------- USER AUTHENTICATION

// @desc Get user profile for authentication
// @route Retrieve/ GET User (Login)
// @access Private
const getUserAuthentication = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified:', decodedToken);
        
        req.userData = { user_id: decodedToken.user_id };
        next();
    } catch (error) {
        // Handle token expiration, invalid signature, etc.
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

// @desc POST user profile for Login
// @route Create/ POST User (Login)
// @access Private
const postUserLogin = asyncHandler (async (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        
        // Find the user by email
        const userLogin = await userProfileSchema.findOne({ user_email });
        
        // Check if user exists
        if (!userLogin) {
            return res.status(401).json({ error: 'User not found' });
        }
        // Check if the user is active
        if (userLogin.user_status !== 'Active') {
            return res.status(401).json({ error: 'User is not active' });
        }
        // Check if the user is approved
        if (userLogin.user_approved !== true) {
            return res.status(401).json({ error: 'User not approved' });
        }
        // Check if the password is valid
        if (!(await bcrypt.compare(user_password, userLogin.user_password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate a JWT token
        const token = jwt.sign({ user_id: userLogin._id }, 'secretKey', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'ERROR', details: error.message });
      } 
});

// @desc POST single user profile from REGISTRATION PAGE
// @route Create/ POST Single User (Registration)
// @access Private
const postUserRegistration = asyncHandler (async (req, res) => {
    try {
        const{ user_firstName, user_lastName, user_mobileNumber, user_email, user_password, user_gender, user_role } = req.body;

        // check for duplicate
        const duplicateEmail = await userProfileSchema.findOne({ user_email }).lean().exec();
        if(duplicateEmail) {
            return res.status(400).json({ message: 'email already exists' });
        };
        
        // hash password
        // 10 salt rounds
        const hashedPassword = await bcrypt.hash(user_password, 10);
        
        const userObject = {
            user_firstName, 
            user_lastName, 
            user_mobileNumber, 
            user_email, 
            "user_password": hashedPassword, 
            user_gender,
            user_role};
        
            // create and store new user
        const newUser = await userProfileSchema.create(userObject);
        
        // user created
        if (newUser) {
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            res.status(400).json({ message: 'failed to create user' });
        };
    } catch (error) {
        console.error('Registration Error: ', error);
        res.status(500).json({ error: 'ERROR' });
    }
    
});

// @desc GET user profile for Logout
// @route Retrieve/ GET User (Logout)
// @access Private
const getUserLogout = (req, res, next) => {
    try {
        // Destroy the session (if using sessions)
        req.session.destroy();
      
        // Clear any authentication tokens or cookies
        // Example with cookies
        localStorage.removeItem('authToken');
      
        // Send a response indicating successful logout
        res.json({ message: 'Logged out successfully' });
    
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
};

// ----------------------------------- USER CRUD

// @desc GET all approved user profiles
// @route Retrieve/ GET All Approved Users
// @access Private
const getAllApprovedUser = asyncHandler (async (req, res) => {
    try {
        const allUser = await userProfileSchema.find({ user_approved: true });
        if (!allUser?.length) {
            return res.status(400).json({ message: 'No User Profile/s Found' });
        };
        res.json(allUser);
    } catch (error) {
        console.error('User Profile Data Fetching Error: ', error);
        res.status(500).json({ error: 'ERROR', details: error.message });
      } 
});

// @desc GET all approval needed user profiles
// @route Retrieve/ GET All Approval Needed Users
// @access Private
const getAllApprovalNeededUser = asyncHandler (async (req, res) => {
    try {
        const allUser = await userProfileSchema.find({ user_approved: false });
        if (!allUser?.length) {
            return res.status(400).json({ message: 'No User Profile/s Found' });
        };
        res.json(allUser);
    } catch (error) {
        console.error('User Profile Data Fetching Error: ', error);
        res.status(500).json({ error: 'ERROR', details: error.message });
      } 
});

// @desc Update Single User
// @route Update/ PATCH Single User
// @access Private
const updateUser = asyncHandler (async (req, res) => {
    try {
        const { 
            user_firstName, 
            user_lastName, 
            user_mobileNumber, 
            user_email, 
            user_password, 
            user_role,
            user_status } = req.body;
        // check if email of the current user exists
        const createdUser = await userProfileSchema.findById(req.params.id).exec();
        if (!createdUser) {
            res.status(400).json({ message: 'user not found' });
        };
        // allow updates to the original user
        const duplicate = await userProfileSchema.findOne({ user_email: user_email }).lean().exec();
        if(duplicate && duplicate?.user_email.toString() !== user_email) {
            return res.status(409).json({ message: 'duplicate email' });
        };
        createdUser.user_firstName = user_firstName;
        createdUser.user_lastName = user_lastName;
        createdUser.user_mobileNumber = user_mobileNumber;
        createdUser.user_email = user_email;
        if (user_password) {
            // hash password
            // 10 salt rounds
            createdUser.user_password = await bcrypt.hash(user_password, 10);
        };
        createdUser.user_role = user_role;
        createdUser.user_status = user_status;
        const updateData = await createdUser.save();
        res.json({ message: `user ${updateData.user_email} updated` });
    } catch (error) {
        console.error('Error in update Student Profile:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// @desc Delete Single User
// @route Delete Single User
// @access Private
const deleteUser = asyncHandler (async (req, res) => {
    try {
        const { id } = req.params;
        
        // check if User ID of the current StudentProfile exists
        const createdUserProfile = await userProfileSchema.findById(id).exec();
        if (!createdUserProfile) {
            res.status(400).json({ message: 'User Profile not found' });
        };
        createdUserProfile.stud_status = "DELETED";
        const updatedStudentProfile = await createdUserProfile.save();
        res.json({ message: `User Profile ${updatedStudentProfile.id} deleted` });
    } catch (error) {
        console.error('Error in delete User Profile:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = {
    allowUserApproval,
    denyUserApproval,
    getUserAuthentication,
    postUserLogin,
    postUserRegistration, 
    getUserLogout,
    getAllApprovedUser,
    getAllApprovalNeededUser, 
    updateUser,
    deleteUser };