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
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AddFacultyDialog = ({ open, onClose }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [gradeValue, setGradeValue] = useState('');
    const [adviserValue, setAdviserValue] = useState('');
    const [facultyProfiles, setFacultyProfiles] = useState([]);

  
    const validationSchema = Yup.object({
      class_grade: Yup.string().required('Employee ID is required'),
      class_section: Yup.string().required('Last Name is required'),
      class_room: Yup.string().required('Middle Name is required'),
      class_syFrom: Yup.string().required('First Name is required'),
      class_syTo: Yup.string().required('Gender is required'),
      facl_employeeId: Yup.string().required('Adviser is required'), 
    });

    useEffect(() => {
      // Fetch faculty profiles from your backend or database
      const fetchFacultyProfiles = async () => {
        try {
          const response = await axios.get('http://localhost:5000/faculty-profile'); // Replace with your API endpoint
          setFacultyProfiles(response.data); // Assuming the response is an array of faculty profiles
        } catch (error) {
          console.error('Error fetching faculty profiles:', error);
        }
      };
  
      fetchFacultyProfiles();
    }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      class_grade: '',
      facl_employeeId: '',
    }
});

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data, e) => {
    try {
        // Make an HTTP POST request to your API endpoint
        const response = await axios.post('http://localhost:5000/class-profile', data);
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
    setGradeValue('');  
    setAdviserValue(''); 
};

const onCancel = () => {
  // Call reset to clear all form fields
  reset();
  onClose();
};
  
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>ADD CLASS</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <DialogContentText>
          Please fill in the class details.
        </DialogContentText>

        <div style={{ display: 'flex', gap: '16px' }}>
            <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Grade</InputLabel>
            <Select
                name="class_grade"
                {...register("class_grade")}
                label="Grade"
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
                error={!!errors.class_grade} // Show error state if there's a validation error
                helperText={errors.class_grade?.message} // Display the error message
            >
                <MenuItem value="KINDER">KINDER</MenuItem>
                <MenuItem value="SPED">SPED</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
            </Select>
            </FormControl>
            <TextField
            name="class_section"
            label="Section Name"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("class_section")}
            error={!!errors.class_section} // Show error state if there's a validation error
            helperText={errors.class_section?.message} // Display the error message
            />
            <TextField
            name="class_room"
            label="Class Room"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("class_room")}
            error={!!errors.class_room} // Show error state if there's a validation error
            helperText={errors.class_room?.message} // Display the error message
            />
        </div>
        
        <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Adviser</InputLabel>
            <Select
                name="facl_employeeId"
                {...register("facl_employeeId")}
                label="Adviser"
                value={adviserValue}
                onChange={(e) => setAdviserValue(e.target.value)}
                error={!!errors.facl_employeeId} // Show error state if there's a validation error
                helperText={errors.facl_employeeId?.message} // Display the error message
            >
                {facultyProfiles.map((profile) => (
                <MenuItem key={profile.facl_employeeId} value={profile.facl_employeeId}>
                  {profile.facl_lastName + ", " + profile.facl_firstName + " " + profile.facl_middleName}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
        <div style={{ display: 'flex', gap: '16px' }}>
        <TextField
            name="class_syFrom"
            label="School Year (From)"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("class_syFrom")}
            error={!!errors.class_syFrom} // Show error state if there's a validation error
            helperText={errors.class_syFrom?.message} // Display the error message
          />
        <TextField
            name="class_syTo"
            label="School Year (To)"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("class_syTo")}
            error={!!errors.class_syTo} // Show error state if there's a validation error
            helperText={errors.class_syTo?.message} // Display the error message
          />     
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<PersonAddAltOutlinedIcon />}>
          Add Class
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

export default AddFacultyDialog;