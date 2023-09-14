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

const AddDengueDialog = ({ open, onClose }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [studentValue, setStudentValue] = useState('');
    const [classValue, setClassValue] = useState('');
    const [facultyValue, setFacultyValue] = useState('');
    const [classProfiles, setClassProfiles] = useState([]);
    const [studentProfiles, setStudentsProfiles] = useState([]);
    const [facultyProfiles, setFacultyProfiles] = useState([]);
  
    const validationSchema = Yup.object({
      deng_onsetDate: Yup.string().required('Employee ID is required'),
      deng_admissionDate: Yup.string().required('Last Name is required'),
      deng_admissionHospital: Yup.string().required('Middle Name is required'),
      deng_dischargeDate: Yup.string().required('First Name is required'),
      stud_id: Yup.string().required('Gender is required'),
      class_id: Yup.string().required('Adviser is required'), 
      facl_id: Yup.string().required('Adviser is required'),
    });

    useEffect(() => {
      // Fetch faculty profiles from your backend or database
      const fetchFacultyProfiles = async () => {
        try {
          const response = await axios.get('http://localhost:5000/class-profile'); // Replace with your API endpoint
          setClassProfiles(response.data); // Assuming the response is an array of faculty profiles
        } catch (error) {
          console.error('Error fetching faculty profiles:', error);
        }
      };
  
      fetchFacultyProfiles();
    }, []);
    
    useEffect(() => {
      // Fetch faculty profiles from your backend or database
      const fetchStudentProfiles = async () => {
        try {
          const response = await axios.get('http://localhost:5000/student-profile'); // Replace with your API endpoint
          setStudentsProfiles(response.data); // Assuming the response is an array of faculty profiles
        } catch (error) {
          console.error('Error fetching faculty profiles:', error);
        }
      };
  
      fetchStudentProfiles();
    }, []);

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
      stud_id: '',
      class_id: '',
      facl_id: '',
    }
});

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data, e) => {
    try {
        const response = await axios.post('http://localhost:5000/dengue-monitoring', data);
        console.log(response.data);

        e.target.reset();
        setSnackbarMessage('Account created successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        e.target.reset();
       
    } catch (error) {
        // Handle any network or other errors
        setSnackbarMessage('An error occurred during registration.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    }
    reset();  
    setStudentValue('');  
    setClassValue(''); 
    setFacultyValue(''); 
};

const onCancel = () => {
  // Call reset to clear all form fields
  reset();
  onClose();
  setStudentValue('');  
  setClassValue('');
  setFacultyValue(''); 
};
  
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>ADD RECORD</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <DialogContentText>
          Please fill in the class details.
        </DialogContentText>

        <div style={{ display: 'flex', gap: '16px' }}>
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
                {classProfiles.map((data) => (
                <MenuItem key={data._id} value={data._id}>
                  {data.class_grade + " - " + data.class_section + " ( " + data.class_syFrom + " - " + data.class_syTo + " )"}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Adviser</InputLabel>
            <Select
                name="facl_id"
                {...register("facl_id")}
                label="Adviser"
                value={facultyValue}
                onChange={(e) => setFacultyValue(e.target.value)}
                error={!!errors.facl_id} // Show error state if there's a validation error
                helperText={errors.facl_id?.message} // Display the error message
            >
                {facultyProfiles.map((data) => (
                <MenuItem key={data._id} value={data._id}>
                  {data.facl_lastName + ", " + data.facl_firstName + " " + data.facl_middleName}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
            
        </div>
        <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Student</InputLabel>
            <Select
                name="stud_id"
                {...register("stud_id")}
                label="Student"
                value={studentValue}
                onChange={(e) => setStudentValue(e.target.value)}
                error={!!errors.stud_id} // Show error state if there's a validation error
                helperText={errors.stud_id?.message} // Display the error message
            >
                {studentProfiles
                .filter((data) => data.class_id === classValue) // Filter students based on selected class ID
              .map((data) => (
              <MenuItem key={data._id} value={data._id}>
              {data.stud_lastName + ", " + data.stud_firstName + " " + data.stud_middleName}
              </MenuItem>
              ))}
            </Select>
            </FormControl>
        <div style={{ display: 'flex', gap: '16px' }}>
        <TextField
            name="deng_onsetDate"
            label="Date of Onset"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            {...register("deng_onsetDate")}
            error={!!errors.deng_onsetDate} // Show error state if there's a validation error
            helperText={errors.deng_onsetDate?.message} // Display the error message
          />
        <TextField
            name="deng_admissionDate"
            label="Date of Admission"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("deng_admissionDate")}
            error={!!errors.deng_admissionDate} // Show error state if there's a validation error
            helperText={errors.deng_admissionDate?.message} // Display the error message
          />     
           <TextField
            name="deng_dischargeDate"
            label="Date of Discharge"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("deng_dischargeDate")}
            error={!!errors.deng_dischargeDate} // Show error state if there's a validation error
            helperText={errors.deng_dischargeDate?.message} // Display the error message
          />    
        </div>
        <TextField
            name="deng_admissionHospital"
            label="Hospital of Admission"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("deng_admissionHospital")}
            error={!!errors.deng_admissionHospital} // Show error state if there's a validation error
            helperText={errors.deng_admissionHospital?.message} // Display the error message
          />

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

export default AddDengueDialog;