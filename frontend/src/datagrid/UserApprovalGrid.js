import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import axios from 'axios';

const UserApprovalGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [userProfile, setUserProfile] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); //Dialog for declined
  const [openApproveDialog, setOpenApproveDialog] = useState(false); //Dialog for openApprove
  const [selectedUserId, setSelectedUserId] = useState("");

  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const openDeclineDialog = () => {
    setOpenDialog(true);
  };
  
  const closeDialog = () => {
    setOpenDialog(false);
  };

  const openApproveConfirmation = () => {
    setOpenApproveDialog(true);
  };

  const closeApproveConfirmation = () => {
    setOpenApproveDialog(false);
  };

  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-approval');
        const modifiedData = response.data.map((item) => ({
          id: item._id,
          user_name: item.user_firstName + '\n' + item.user_lastName,
          user_mobileNumber: item.user_mobileNumber,
          user_email: item.user_email,
          user_gender: item.user_gender,
          user_role: item.user_role,
          user_status: item.user_status,
          approval: item.user_approved,
          user_createdAt: item.createdAt,
          user_updatedAt: item.updatedAt,
        }));
        setUserProfile(modifiedData);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once

  const columns = [
    { field: 'id', headerName: 'ID', width: 100},
    { field: 'user_name', headerName: 'Name', width: 200},
    { field: 'user_mobileNumber', headerName: 'Mobile Number', width: 150},
    { field: 'user_email', headerName: 'Email', width: 250},
    { field: 'user_gender', headerName: 'Gender', width: 150},
    { field: 'user_role', headerName: 'Role', width: 150},
    { 
    field: 'user_createdAt', 
    headerName: 'Date Created', 
    width: 150,
    valueGetter: (params) => formatYearFromDate(params.row.user_createdAt),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div>
        <IconButton 
          onClick={() => handleAccept(params.row.id)}
          style={{ color: 'green' }}
          >
            <CheckCircleOutlinedIcon />
          </IconButton>
        <IconButton 
          onClick={() => handleDecline(params.row.id)}
          style={{ color: 'red' }}
          >
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleConfirmApprove = async () => {
    try {
      // Send a request to your server to update the 'approved' field for the user with the selectedUserId
      const response = await axios.patch(`http://localhost:5000/user-approval/${selectedUserId}`);
  
      if (response.ok) {
        // Update the user in the state to mark them as approved
        setUserProfile((prevUsers) => {
          return prevUsers.map((user) => {
            if (user.id === selectedUserId) {
              return { ...user, user_approved: true };
            }
            return user;
          });
        });
      } else {
        console.error('Error confirming approval:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    closeApproveConfirmation();
  };

  const handleConfirmDecline = async () => {
    try {
      // Send a DELETE request to your server to delete the user with the selected '_id'
      const response = await axios.delete(`http://localhost:5000/user-approval/${selectedUserId}`);

      if (response.ok) {
        // Update the UI by removing the declined user from the list
        const updatedUsers = userProfile.filter((user) => user.id !== selectedUserId);
        setUserProfile(updatedUsers);
        console.log(`Declined user with ID: ${selectedUserId}`);
      } else {
        console.error('Error declining user:', response.statusText);
      }
    } catch (error) {
      console.error('Error declining user:', error);
    }

    // Close the dialog after the action is complete
    closeDialog();
  };

  const handleDecline = async (_id) => {
      // Set the selected user's _id to the state variable
      setSelectedUserId(_id);
      openDeclineDialog();
    };

    const handleAccept = async (_id) => {
      // Set the selected user's _id to the state variable
      setSelectedUserId(_id);
      openApproveConfirmation();
    };

    const filteredUsers = userProfile.filter(user => 
      user.id.toString().includes(searchValue) ||
      user.user_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.user_mobileNumber.toString().includes(searchValue) ||
      user.user_email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.user_gender.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.user_role.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.user_status.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.user_createdAt.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <div className="ml-2">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      </div>
      <DataGrid 
      rows={filteredUsers}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[10]}
      checkboxSelection
      disableRowSelectionOnClick
      getRowId={(row) => row.id}  
      />
    </div>
    </div>
        <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>Confirm Decline</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to decline this user?
            </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
        <Button onClick={() => handleConfirmDecline()} color="primary">
            Confirm
        </Button>
      </DialogActions>
          </Dialog>
          <Dialog open={openApproveDialog} onClose={closeApproveConfirmation}>
          <DialogTitle>Confirm Approve</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to approve this user?
            </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={closeApproveConfirmation} color="primary">
            Cancel
          </Button>
        <Button onClick={() => handleConfirmApprove()} color="primary">
            Confirm
        </Button>
      </DialogActions>
          </Dialog>
    </div>
  );
};

export default UserApprovalGrid;