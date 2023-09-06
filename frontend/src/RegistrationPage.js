// src/RegistrationPage.js
import React, { useState } from 'react';
import { Paper, Grid, TextField, Button, InputAdornment, Select, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import clinicLogo from './Data/medical.png';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const RegistrationPage = () => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [error, setError] = useState('');
  const validationSchema = Yup.object({
    user_firstName: Yup.string().required('First Name is required'),
    user_lastName: Yup.string().required('Last Name is required'),
    user_mobileNumber: Yup.string().required('Phone Number is required').min(10, "must be 10 digits"),
    user_email: Yup.string().email('Invalid email').required('Email is required').matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
      'Invalid email format'
    ),
    user_password: Yup.string().required('Password is required').min(6, "must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('user_password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    user_gender: Yup.string().required('Gender is required'),
    user_role: Yup.string().required('Role is required'),
  });
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleShowConfirmPasswordClick = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const formik = useFormik({
    initialValues: {
      user_firstName: '',
      user_lastName: '',
      user_mobileNumber: '',
      user_email: '',
      user_password: '',
      confirmPassword: '',
      user_gender: '',
      user_role: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post('http://localhost:5000/registration', values);
        console.log(response.data); // Display response from the server

        resetForm();
        setSnackbarMessage('Account created successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);


        // setSnackbarOpen(true);
      } catch (error) {
        setError('An error occurred during registration.'); // Set an error message
        setSnackbarMessage('An error occurred during registration.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    },
  });

  console.log('touched:', formik.touched.user_gender);
  console.log('errors:', formik.errors.user_gender);
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left-side Image */}
      
      <Grid item xs={false} sm={4} md={7} sx={{ display: isSmallScreen ? 'none' : 'block', backgroundColor: '#6C63FF', minHeight: '100vh' }}>
        <div className="flex justify-center items-center h-full">
          <img src={clinicLogo} alt="Clinic Logo" style={{ width: '600px', height: '430px' }} />
        </div>
      </Grid>

      {/* Right-side Registration Form */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={
        { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: isSmallScreen ? 'transparent' : '#FFF' }}>
        <div className="flex justify-center items-center h-full">
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
             {/* Add new Grid item for "Create an account" */}
             <Grid item xs={12}>
              <div className="flex justify-center mb-6">
                <h2 className='text-4xl font-bold'>Create an account</h2>
              </div>
            </Grid>
            {/* Separate First Name and Last Name */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
                <TextField 
                name="user_firstName"
                label="First Name" 
                fullWidth 
                margin="normal"
                sx={{ width: '270px', margin: '0 15px' }}  
                {...formik.getFieldProps('user_firstName')} // Use getFieldProps to handle props
                InputProps={{
                  value: formik.values.user_firstName,
                  onChange: (e) => {
                    const input = e.target.value;
                    const capitalizedInput = input
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    formik.setFieldValue('user_firstName', capitalizedInput);
                  },
                }}
                helperText={
                    formik.touched.user_firstName && formik.errors.user_firstName ? (
                      <span style={{ color: 'red' }}>
                        {formik.errors.user_firstName}
                      </span>
                    ) : ''
                  }
                  error={formik.touched.user_firstName && Boolean(formik.errors.user_firstName)}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
                <TextField
                name="user_lastName"
                label="Last Name" 
                fullWidth 
                margin="normal" 
                sx={{ width: '270px', margin: '0 15px' }}  
                {...formik.getFieldProps('user_lastName')}
                InputProps={{
                  value: formik.values.user_lastName,
                  onChange: (e) => {
                    const input = e.target.value;
                    const capitalizedInput = input
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    formik.setFieldValue('user_lastName', capitalizedInput);
                  },
                }}
                helperText={
                  formik.touched.user_lastName && formik.errors.user_lastName ? (
                    <span style={{ color: 'red' }}>
                      {formik.errors.user_lastName}
                    </span>
                  ) : ''
                }
                error={formik.touched.user_lastName && Boolean(formik.errors.user_lastName)}
              />
              </Grid>
            {/* Continue with the rest of the form */}
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <TextField
                name="user_mobileNumber"
                label="Phone Number"
                fullWidth
                margin="normal"  
                {...formik.getFieldProps('user_mobileNumber')}
                onChange={(e) => {
                  const formattedPhoneNumber = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                  formik.setFieldValue('user_mobileNumber', formattedPhoneNumber.slice(0, 10)); // Limit to 11 digits
                }}
                InputProps={{
                  ...formik.getFieldProps('user_mobileNumber').inputProps,
                  startAdornment: <InputAdornment position="start">+63</InputAdornment>,
                  placeholder: '995 215 5436',
                }}
                sx={{ width: '270px', margin: '0 15px' }}
                helperText={
                  formik.touched.user_mobileNumber && formik.errors.user_mobileNumber ? (
                    <span style={{ color: 'red' }}>
                      {formik.errors.user_mobileNumber}
                    </span>
                  ) : ''
                }
                error={formik.touched.user_mobileNumber && Boolean(formik.errors.user_mobileNumber)}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <TextField 
              name="user_email"
              label="Email" 
              fullWidth 
              margin="normal"
              sx={{ width: '270px', margin: '0 15px' }}  
              {...formik.getFieldProps('user_email')}
              helperText={
                formik.touched.user_email && formik.errors.user_email ? (
                  <span style={{ color: 'red' }}>
                    {formik.errors.user_email}
                  </span>
                ) : ''
              }
              error={formik.touched.user_email && Boolean(formik.errors.user_email)}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <TextField
                name = "user_password"
                label="Password"
                type={showPassword ? 'text' : 'user_password'}
                fullWidth
                margin="normal"  
                {...formik.getFieldProps('user_password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Toggle password visibility */}
                      {showPassword ? (
                        <VisibilityOff onClick={handleShowPasswordClick} style={{ cursor: 'pointer' }} />
                      ) : (
                        <Visibility onClick={handleShowPasswordClick} style={{ cursor: 'pointer' }} />
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '270px', margin: '0 15px' }}
                helperText={
                  formik.touched.user_password && formik.errors.user_password ? (
                    <span style={{ color: 'red' }}>
                      {formik.errors.user_password}
                    </span>
                  ) : ''
                }
                error={formik.touched.user_password && Boolean(formik.errors.user_password)}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'user_password'}
                fullWidth
                margin="normal"  
                {...formik.getFieldProps('confirmPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Toggle confirm password visibility */}
                      {showConfirmPassword ? (
                        <VisibilityOff onClick={handleShowConfirmPasswordClick} style={{ cursor: 'pointer' }} />
                      ) : (
                        <Visibility onClick={handleShowConfirmPasswordClick} style={{ cursor: 'pointer' }} />
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '270px', margin: '0 15px' }}
                helperText={
                  formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <span style={{ color: 'red' }}>
                      {formik.errors.confirmPassword}
                    </span>
                  ) : ''
                }
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <Select
                name = "user_gender"
                label="Gender"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('user_gender')}
                displayEmpty
                inputProps={{ 'aria-label': 'Select your Gender' }}
                sx={{ width: '270px', margin: '0 15px' }}
                helperText={
                  formik.touched.user_gender && formik.errors.user_gender ? (
                    <span style={{ color: 'red' }}>
                      {formik.errors.user_gender}
                    </span>
                  ) : ''
                }
                error={formik.touched.user_gender && Boolean(formik.errors.user_gender)}
              >
                <MenuItem value="" disabled>
                  Select your Gender
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '80%' : 'auto', margin: isSmallScreen ? '0 auto' : '0' }}>
              <Select
                name="user_role"
                label="Role"
                fullWidth
                margin="normal"  
                {...formik.getFieldProps('user_role')}
                displayEmpty
                inputProps={{ 'aria-label': 'Select your role' }}
                sx={{ width: '270px', margin: '0 15px' }}
                helperText={
                  formik.touched.user_role && formik.errors.user_role ? (
                    <span style={{ color: 'red' }}>
                      {formik.errors.user_role}
                    </span>
                  ) : ''
                }
                error={formik.touched.user_role && Boolean(formik.errors.user_role)}
              >
                <MenuItem value="" disabled>
                  Select your role
                </MenuItem>
                <MenuItem value="Nurse">Nurse</MenuItem>
                <MenuItem value="District Nurse">District Nurse</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
            <div className="flex justify-center mt-4">
              <Button 
              variant="contained" 
              fullWidth 
              style={{ 
                width: '150px', 
                height: '50px', 
                marginTop: '20px', 
                borderRadius: '10px', 
                backgroundColor: formik.isValid ? '#020826' : '#CCCCCC',
                color: formik.isValid ? '#FFFFFF' : '#707070',
              }}
              onClick={formik.handleSubmit}
              disabled={!formik.isValid || Object.values(formik.values).some(value => value === '')}
              >
                Register
              </Button>
            </div>
            </Grid>
            <div className="flex justify-center mt-2">
              <span style={{ color: '#707070' }}>Already have an account?</span>{' '}
              <Link to="/" className="font-semibold">
                Login here
              </Link>
            </div>
          </Grid>
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{
          vertical: 'top', // Position at the top
          horizontal: 'center', // Position at the center horizontally
              }}>
              <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
                {snackbarMessage}
              </MuiAlert>
          </Snackbar>
        </div>
      </Grid>
    </Grid>
  );
};

export default RegistrationPage;