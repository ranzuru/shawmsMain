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

const AddStudentDialog = ({ open, onClose }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [genderValue, setGenderValue] = useState('');
    const [fourPValue, setFourPValue] = useState('');
    const [statusValue, setStatusValue] = useState('');
    const [classValue, setClassValue] = useState('');
    const [classOptions, setClassOptions] = useState([]);
  
const validationSchema = Yup.object({
    stud_lrn: Yup.string().required('Student LRN is required'),
    stud_firstName: Yup.string().required('First Name is required'),
    stud_middleName: Yup.string().required('Middle Name is required'),
    stud_lastName: Yup.string().required('Last Name is required'),
    stud_gender: Yup.string().required('Gender is required'),
    stud_birthDate: Yup.string().required('Birth Date is required'),
    stud_age: Yup.string().required('Age is required'),
    stud_4p: Yup.string().required('4P is required'),
    class_id: Yup.string().required('Grade & Section is required'),
    stud_parentName1: Yup.string().required('Parent 1 Name is required'),
    stud_parentMobile1: Yup.string().required('Parent 1 Mobile Number is required').min(10, "Your phone number must be 10 digits"),
    stud_address: Yup.string().required('Address is required'),
  });

  useEffect(() => {
    // Make an HTTP GET request to fetch the classes
    axios.get('http://localhost:5000/class-profile')
      .then((response) => {
        const classes = response.data; // Assuming the response contains an array of classes
        setClassOptions(classes);
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      stud_gender: '',
      stud_4p: '', 
      stud_status: '',
      class_id: '',
    },
});

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data, e) => {
    try {
        // Make an HTTP POST request to your API endpoint
        const response = await axios.post('http://localhost:5000/student-profile', data);
        console.log(response.data); // Display response from the server

        e.target.reset();
        setSnackbarMessage('Account created successfully!');
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
  setFourPValue('');
  setStatusValue('');
  setClassValue('');
};
  
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>ADD STUDENT</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <DialogContentText>
          Please fill in the student details.
        </DialogContentText>

        <div style={{ display: 'flex', gap: '16px' }}>
            <TextField
            name="stud_lrn"
            label="Student LRN"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("stud_lrn")}
            error={!!errors.stud_lrn} // Show error state if there's a validation error
            helperText={errors.stud_lrn?.message} // Display the error message
            />
            <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select
                name="stud_status"
                {...register("stud_status")}
                label="Status"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                error={!!errors.stud_status} // Show error state if there's a validation error
                helperText={errors.stud_status?.message} // Display the error message
              >
                <MenuItem value="" disabled>Select the current status of the student</MenuItem>
                <MenuItem value="Not Enrolled">Not Enrolled</MenuItem>
                <MenuItem value="Enrolled">Enrolled</MenuItem>
                <MenuItem value="On Process">On Process</MenuItem>
                <MenuItem value="Transferred">Transferred</MenuItem>
                <MenuItem value="Dropped">Dropped</MenuItem>
            </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Class</InputLabel>
            <Select
                name="class_id"
                {...register("class_id")}
                label="Class"
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
                error={!!errors.class_id} // Show error state if there's a validation error
                helperText={errors.class_id?.message} // Display the error message
            >
                <MenuItem value="" disabled>
                Select the current class of the student
              </MenuItem>
              {/* Map over classOptions to create MenuItems */}
              {classOptions.length > 0 ? (
                // Map over classOptions to create MenuItems
                classOptions.map((classOption) => (
                  <MenuItem key={classOption._id} value={classOption._id}>
                    {`${classOption.class_grade} - ${classOption.class_section}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  Loading classes...
                </MenuItem>
              )}
            </Select>
            </FormControl>
        </div>
        
        <TextField
          name="stud_firstName"
          label="First Name"
          fullWidth
          required
          margin="normal"
          variant="outlined"
          {...register("stud_firstName")}
          error={!!errors.stud_firstName} // Show error state if there's a validation error
          helperText={errors.stud_firstName?.message} // Display the error message
        />
        <div style={{ display: 'flex', gap: '16px' }}>
            <TextField
            name="stud_middleName"
            label="Middle Name"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("stud_middleName")}
            error={!!errors.stud_middleName} // Show error state if there's a validation error
            helperText={errors.stud_middleName?.message} // Display the error message
            />
            <TextField
            name="stud_lastName"
            label="Last Name"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("stud_lastName")}
            error={!!errors.stud_lastName} // Show error state if there's a validation error
            helperText={errors.stud_lastName?.message} // Display the error message
            />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
            <TextField
            name="stud_birthDate"
            label="Birth Date"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("stud_birthDate")}
            error={!!errors.stud_birthDate} // Show error state if there's a validation error
            helperText={errors.stud_birthDate?.message} // Display the error message
            />
            <TextField
            name="stud_age"
            label="Age"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("stud_age")}
            error={!!errors.stud_age} // Show error state if there's a validation error
            helperText={errors.stud_age?.message} // Display the error message
            />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
            <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Gender</InputLabel>
            <Select
                name="stud_gender"
                {...register("stud_gender")}
                label="Gender"
                value={genderValue}
                onChange={(e) => setGenderValue(e.target.value)}
                error={!!errors.stud_gender} // Show error state if there's a validation error
                helperText={errors.stud_gender?.message} // Display the error message
            >
                <MenuItem value="" disabled>Select Student Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
            </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>4P Beneficiary</InputLabel>
            <Select
                name="stud_4p"
                {...register("stud_4p")}
                label="4P Beneficiary"
                value={fourPValue}
                onChange={(e) => setFourPValue(e.target.value)}
                error={!!errors.stud_4p} // Show error state if there's a validation error
                helperText={errors.stud_4p?.message} // Display the error message
            >
                <MenuItem value="" disabled>Is the Student a 4p beneficiary</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
            </Select>
            </FormControl>
        </div>
            
        <div style={{ display: 'flex', gap: '16px' }}>
            <TextField
            name="stud_parentName1"
            label="Parent 1 Full Name"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("stud_parentName1")}
            error={!!errors.stud_parentName1} // Show error state if there's a validation error
            helperText={errors.stud_parentName1?.message} // Display the error message
            />  
            <TextField
            name="stud_parentMobile1"
            label="Parent 1 Mobile Number"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register('stud_parentMobile1')}
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
            error={!!errors.stud_parentMobile1} // Show error state if there's a validation error
            helperText={errors.stud_parentMobile1?.message} // Display the error message
            />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
        <TextField
            name="stud_parentName2"
            label="Parent 2 Full Name"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("stud_parentName2")}
            error={!!errors.stud_parentName2} // Show error state if there's a validation error
            helperText={errors.stud_parentName2?.message} // Display the error message
            />  
            <TextField
            name="stud_parentMobile2"
            label="Parent 2 Mobile Number"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register('stud_parentMobile2')}
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
            error={!!errors.stud_parentMobile2} // Show error state if there's a validation error
            helperText={errors.stud_parentMobile2?.message} // Display the error message
            />
        </div>
        
        <TextField
            name="stud_address"
            label="Address"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("stud_address")}
            error={!!errors.stud_address} // Show error state if there's a validation error
            helperText={errors.stud_address?.message} // Display the error message
        /> 

      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<PersonAddAltOutlinedIcon />}>
          Add Student
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

export default AddStudentDialog;
