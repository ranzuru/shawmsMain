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
    const [typeValue, setTypeValue] = useState('');
    const [classValue, setClassValue] = useState('');
    const [classProfiles, setClassProfiles] = useState([]);

  
    const validationSchema = Yup.object({
      immu_male4p: Yup.string().required('Employee ID is required'),
      immu_female4p: Yup.string().required('Last Name is required'),
      immu_maleNon4p: Yup.string().required('Middle Name is required'),
      immu_femaleNon4p: Yup.string().required('First Name is required'),
      immu_total: Yup.string().required('Gender is required'),
      immu_type: Yup.string().required('Gender is required'),
      class_id: Yup.string().required('Adviser is required'), 
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

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      immu_type: '',
      class_id: '',
    }
});

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data, e) => {
    try {
        const response = await axios.post('http://localhost:5000/deworming-monitoring', data);
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
    setTypeValue('');  
    setClassValue(''); 
};

const onCancel = () => {
  // Call reset to clear all form fields
  reset();
  onClose();
  setTypeValue('');  
  setClassValue('');
};
  
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>ADD CLASS</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <DialogContentText>
          Please fill in the class details.
        </DialogContentText>

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
                {classProfiles.map((profile) => (
                <MenuItem key={profile._id} value={profile._id}>
                  {profile.class_grade + " - " + profile.class_section + " ( " + profile.class_syFrom + " - " + profile.class_syTo + " )"}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
            <div style={{ display: 'flex', gap: '16px' }}>
        <TextField
            name="immu_male4p"
            label="Male 4p"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("immu_male4p")}
            error={!!errors.immu_male4p} // Show error state if there's a validation error
            helperText={errors.immu_male4p?.message} // Display the error message
          />
        <TextField
            name="immu_female4p"
            label="Female 4P"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("immu_female4p")}
            error={!!errors.immu_female4p} // Show error state if there's a validation error
            helperText={errors.immu_female4p?.message} // Display the error message
          />     
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
        <TextField
            name="immu_maleNon4p"
            label="Male Non-4P"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("immu_maleNon4p")}
            error={!!errors.immu_maleNon4p} // Show error state if there's a validation error
            helperText={errors.immu_maleNon4p?.message} // Display the error message
          />
        <TextField
            name="immu_femaleNon4p"
            label="Female Non-4P"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("immu_femaleNon4p")}
            error={!!errors.immu_femaleNon4p} // Show error state if there's a validation error
            helperText={errors.immu_femaleNon4p?.message} // Display the error message
          />     
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
        <TextField
            name="immu_total"
            label="Total"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("immu_total")}
            error={!!errors.immu_total} // Show error state if there's a validation error
            helperText={errors.immu_total?.message} // Display the error message
          />    
            <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Type</InputLabel>
            <Select
                name="immu_type"
                {...register("immu_type")}
                label="Type"
                value={typeValue}
                onChange={(e) => setTypeValue(e.target.value)}
                error={!!errors.immu_type} // Show error state if there's a validation error
                helperText={errors.immu_type?.message} // Display the error message
            >
                <MenuItem value="Enrolled">Enrolled</MenuItem>
                <MenuItem value="De-Wormed">De-Wormed</MenuItem>
            </Select>
            </FormControl>
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