import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const EditUserDialog = ({ open, onClose, initialData }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [genderValue, setGenderValue] = useState('');
    const [roleValue, setRoleValue] = useState('');
    const [statusValue, setStatusValue] = useState('');
  
const validationSchema = Yup.object({
  user_firstName: Yup.string().required('First Name is required'),
  user_lastName: Yup.string().required('Last Name is required'),
  user_mobileNumber: Yup.string().required('Phone Number is required').min(10, "Your phone number must be 10 digits"),
  user_email: Yup.string().email('Invalid email').required('Email is required').matches(
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
    'Invalid email format'
  ),
    user_gender: Yup.string().required('Gender is required'),
    user_role: Yup.string().required('Role is required'),
    user_status: Yup.string().required('Status is required'),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData || {},
});

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (initialData) {
      // Verify if initialData is being applied to state variables
      console.log("Initial Data:", initialData);
      // Initialize state values
      setGenderValue(initialData.user_gender || "");
      setRoleValue(initialData.user_role || "");
      setStatusValue(initialData.user_status || "");
    }
  }, [initialData]);

  const onSubmit = async (data, e) => {
    try {
        // Make an HTTP POST request to your API endpoint
        const response = await axios.patch('http://localhost:5000/user-profile/', data);
        console.log(response.data); // Display response from the server

        e.target.reset();
        setSnackbarMessage('User edited successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
            // Reset the form
        e.target.reset();
       
    } catch (error) {
        // Handle any network or other errors
        setSnackbarMessage('An error occurred during registration.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    }
    reset();    
};

const onCancel = () => {
  // Call reset to clear all form fields
  reset();
  onClose();
  setGenderValue('');
  setRoleValue('');
  setStatusValue('');
};

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>EDIT USER</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <DialogContentText>
          Please fill in the user details.
        </DialogContentText>

        <div style={{ display: 'flex', gap: '16px' }}>
        <TextField
          name="id"
          label="ID"
          fullWidth
          disabled
          margin="normal"
          variant="outlined"
          {...register("id")}
        />
        <FormControl fullWidth variant="outlined" margin="normal" required>
          <InputLabel>Status</InputLabel>
          <Select
            name="user_status"
            {...register("user_status")}
            label="Status"
            value={statusValue}
            onChange={(e) => setStatusValue(e.target.value)}
            error={!!errors.user_status} // Show error state if there's a validation error
            helperText={errors.user_status?.message} // Display the error message
          >
            <MenuItem value="" disabled>Select your gender</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        </div>
        <TextField
          name="user_firstName"
          label="First Name"
          fullWidth
          margin="normal"
          variant="outlined"
          {...register("user_firstName")}
          error={!!errors.user_firstName} // Show error state if there's a validation error
          helperText={errors.user_firstName?.message} // Display the error message
        />
        <TextField
          name="user_lastName"
          label="Last Name"
          fullWidth
          margin="normal"
          variant="outlined"
          {...register("user_lastName")}
          error={!!errors.user_lastName} // Show error state if there's a validation error
          helperText={errors.user_lastName?.message} // Display the error message
        />
        <div style={{ display: 'flex', gap: '16px' }}>
        <TextField
          name="user_email"
          label="Email"
          fullWidth
          margin="normal"
          variant="outlined"
          {...register("user_email")}
          error={!!errors.user_email} // Show error state if there's a validation error
          helperText={errors.user_email?.message} // Display the error message
            />
        <TextField
          name="user_mobileNumber"
          label="Mobile Number"
          fullWidth
          required
          margin="normal"
          variant="outlined"
          {...register('user_mobileNumber')}
          onChange={(e) => {
            // Use slice(0, 10) to keep only the first 10 characters
            const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
            // Update the input field with the sliced value
            e.target.value = numericValue;
        }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">+63</InputAdornment>
            ),
            placeholder: '995 215 5436',
          }}
          error={!!errors.user_mobileNumber} // Show error state if there's a validation error
          helperText={errors.user_mobileNumber?.message} // Display the error message
        />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
        <FormControl fullWidth variant="outlined" margin="normal" required>
          <InputLabel>Gender</InputLabel>
          <Select
            name="user_gender"
            {...register("user_gender")}
            label="Gender"
            value={genderValue}
            onChange={(e) => setGenderValue(e.target.value)}
            error={!!errors.user_gender} // Show error state if there's a validation error
            helperText={errors.user_gender?.message} // Display the error message
          >
            <MenuItem value="" disabled>Select your gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select
            name="user_role"
            {...register("user_role")}
            label="Role"
            value={roleValue}
            onChange={(e) => setRoleValue(e.target.value)}
            error={!!errors.user_role} // Show error state if there's a validation error
            helperText={errors.user_role?.message} // Display the error message
          >
            <MenuItem value="" disabled>Select your role</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Nurse">Nurse</MenuItem>
            <MenuItem value="District Nurse">District Nurse</MenuItem>
            <MenuItem value="Teacher">Teacher</MenuItem>
          </Select>
        </FormControl>
        
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<PersonAddAltOutlinedIcon />}>
          Edit User
        </Button>
      </DialogActions>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{
          vertical: 'top', // Position at the top
          horizontal: 'center', // Position at the center horizontally
              }}>
              <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
                {snackbarMessage}
              </MuiAlert>
          </Snackbar>
      </form>
    </Dialog>
  );
};

export default EditUserDialog;
