import React, {useState} from 'react';
import { Paper, Grid, TextField, Button, InputAdornment, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import schoolLogo from './Data/DonjuanTransparent.png';
import clinicLogo from './Data/medical.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [user_email, setEmail] = useState('');
  const [user_password, setPassword] = useState('');
  const [emailRequired, setEmailRequired] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [emailFormatValid, setEmailFormatValid] = useState(true);

  const handleShowPasswordClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleLogin = async () => {

    // Reset previous validation messages
    setEmailRequired(false);
    setEmailFormatValid(true);
    setPasswordRequired(false);

    // Check if email and password are not empty
    if (!user_email) {
      setEmailRequired(true);
    }
    if (!user_password) {
      setPasswordRequired(true);
    }

    // Validate email format
    if (!emailRegex.test(user_email)) {
      setEmailFormatValid(false);
      return;
    }

    // If any validation message is displayed, don't proceed with login
    if (emailRequired || passwordRequired) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
        user_email: user_email,
        user_password: user_password,
      });

      if (response.data.token) {
        const token = response.data.token;

        localStorage.setItem('authToken', token);

        navigate('/dashboard');
      } else {
        setShowWarning(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setShowWarning(true);
    }
  };
  
  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left-side Image */}
      <Grid item xs={12} sm={4} md={7} sx={{ display: isSmallScreen ? 'none' : 'block', backgroundColor: '#6C63FF', minHeight: '100vh' }}>
          <div className="flex justify-center items-center h-full">
            <img src={clinicLogo} alt="Clinic Logo" style={{ width: '600px', height: '430px' }} />
        </div>
          </Grid>

      {/* Right-side Login Form */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: isSmallScreen ? 'transparent' : '#FFF' }}>
          <Grid item xs={10} sm={8} md={6}>
            {/* Add form components here */}
            <div className="flex flex-col space-y-4 text-center">
              <div className="flex justify-center">
                <img src={schoolLogo} alt="School Logo" style={{ width: '100px', height: '100px' }} />
              </div>
              <h1 className="text-lg font-semibold">Don Juan Dela Cruz Central Elementary School</h1>
              <div className="flex items-start">
                <h2 className="text-4xl font-bold">Login</h2>
              </div>
              <TextField 
              label="Email" 
              fullWidth margin="normal" 
              value = {user_email} 
              onChange={(e) => setEmail(e.target.value)} 
              autoComplete="user_email"
              error={emailRequired || !emailFormatValid}
              helperText={emailRequired ? 'Email required' : !emailFormatValid ? 'Invalid email format' : ''}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'user_password'}
                fullWidth
                margin="normal"
                value={user_password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
              error={passwordRequired}
              helperText={passwordRequired ? 'Password required' : ''}
                />
           
           <div className="flex justify-between w-full">
            <a href="#forgot-password" className="text-gray-700 hover:underline">
              Forgot password?
            </a>
            <MuiLink component={RouterLink} to="/register" className="text-black hover:underline">
               Sign up here
            </MuiLink>
            </div>
              <div className="flex justify-center mt-4">
                <Button variant="contained" style={{ width: '150px', height: '50px', borderRadius: '10px', backgroundColor: '#020826' }} onClick={handleLogin}>
                  Login
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      <Dialog open={showWarning} onClose={handleCloseWarning}>
        <DialogTitle>Invalid Credentials</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The entered email or password is incorrect. Please try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarning} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default LoginPage;
