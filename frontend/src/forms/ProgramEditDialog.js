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

const EditFacultyDialog = ({ open, onClose, initialData }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [genderValue, setGenderValue] = useState('');
    const [roleValue, setRoleValue] = useState('');
    const [statusValue, setStatusValue] = useState('');
  
const validationSchema = Yup.object({
    facl_employeeId: Yup.string().required('Employee ID is required'),
    facl_firstName: Yup.string().required('First Name is required'),
    facl_middleName: Yup.string().required('Middle Name is required'),
    facl_lastName: Yup.string().required('Last Name is required'),
    facl_gender: Yup.string().required('Gender is required'),
    facl_mobileNumber: Yup.string().required('Parent 1 Mobile Number is required').min(10, "Your phone number must be 10 digits"),
    facl_role: Yup.string().required('Role is required'),
    facl_status: Yup.string().required('Parent 1 Mobile Number is required'),
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
      setGenderValue(initialData.facl_gender || "");
      setStatusValue(initialData.facl_status || "");
      setRoleValue(initialData.facl_role || "");
    }
  }, [initialData]);

  const onSubmit = async (data, e) => {
    try {
        // Make an HTTP POST request to your API endpoint
        const response = await axios.patch('http://localhost:5000/faculty-profile', data);
        console.log(response.data); // Display response from the server

        e.target.reset();
        setSnackbarMessage('Faculty edited successfully!');
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
      <DialogTitle>EDIT FACULTY</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <DialogContentText>
          Please fill in the faculty details.
        </DialogContentText>

        <div style={{ display: 'flex', gap: '16px' }}>
          <TextField
            name="facl_employeeId"
            label="Employee ID"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("facl_employeeId")}
            error={!!errors.facl_employeeId} // Show error state if there's a validation error
            helperText={errors.facl_employeeId?.message} // Display the error message
          />
            <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select
                name="facl_status"
                {...register("facl_status")}
                label="Status"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                error={!!errors.facl_status} // Show error state if there's a validation error
                helperText={errors.facl_status?.message} // Display the error message
            >
                <MenuItem value="" disabled>Select the current status of the faculty</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            </FormControl>
        </div>
        
        <TextField
            name="facl_firstName"
            label="First Name"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("facl_firstName")}
            error={!!errors.facl_firstName} // Show error state if there's a validation error
            helperText={errors.facl_firstName?.message} // Display the error message
          />
        <div style={{ display: 'flex', gap: '16px' }}>
        <TextField
            name="facl_middleName"
            label="Middle Name"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("facl_middleName")}
            error={!!errors.facl_middleName} // Show error state if there's a validation error
            helperText={errors.facl_middleName?.message} // Display the error message
          />
        <TextField
            name="facl_lastName"
            label="Last Name"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("facl_lastName")}
            error={!!errors.facl_lastName} // Show error state if there's a validation error
            helperText={errors.facl_lastName?.message} // Display the error message
          />     
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
        <FormControl fullWidth variant="outlined" margin="normal" required>
          <InputLabel>Gender</InputLabel>
          <Select
            name="facl_gender"
            {...register("facl_gender")}
            label="Gender"
            value={genderValue}
            onChange={(e) => setGenderValue(e.target.value)}
            error={!!errors.facl_gender} // Show error state if there's a validation error
            helperText={errors.facl_gender?.message} // Display the error message
          >
            <MenuItem value="" disabled>Select your gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>

          <TextField
            name="facl_mobileNumber"
            label="Mobile Number"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register('facl_mobileNumber')}
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
            error={!!errors.facl_mobileNumber} // Show error state if there's a validation error
            helperText={errors.facl_mobileNumber?.message} // Display the error message
          />
          <FormControl fullWidth variant="outlined" margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select
            name="facl_role"
            {...register("facl_role")}
            label="Gender"
            value={roleValue}
            onChange={(e) => setRoleValue(e.target.value)}
            error={!!errors.facl_role} // Show error state if there's a validation error
            helperText={errors.facl_role?.message} // Display the error message
          >
            <MenuItem value="" disabled>Select your Role</MenuItem>
                <MenuItem value="Nurse">Janitor</MenuItem>
                <MenuItem value="Nurse">Guard</MenuItem>
                <MenuItem value="Nurse">Canteen Staff</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
                <MenuItem value="Nurse">Nurse</MenuItem>
                <MenuItem value="Doctor">Doctor</MenuItem>
                <MenuItem value="Nurse">District Nurse</MenuItem>
                <MenuItem value="Nurse">Office Staff</MenuItem>
                <MenuItem value="Administrator">Administrator</MenuItem>
                <MenuItem value="Principal">Principal</MenuItem>
          </Select>
        </FormControl>
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<PersonAddAltOutlinedIcon />}>
          Edit Faculty
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

export default EditFacultyDialog;
