import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddDialog from '../forms/UserAddDialog.js'
import EditDialog from '../forms/UserEditDialog.js'
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

const UserProfileGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [dialogInitialData, setDialogInitialData] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // ------------------------- POPULATE LIST FUNCTIONS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-profile');
        const modifiedData = response.data.map((item) => ({
          id: item._id,
          user_firstName: item.user_firstName,
          user_lastName: item.user_lastName,
          user_mobileNumber: item.user_mobileNumber,
          user_email: item.user_email,
          user_gender: item.user_gender,
          user_role: item.user_role,
          user_status: item.user_status,
          approval: item.user_approved,
          user_createdAt: item.createdAt,
          user_updatedAt: item.updatedAt,
        }));
        setUserData(modifiedData);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };
    fetchData();
  }, []);

  // ------------------------- LIST FUNCTIONS
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
    },
    {
      field: 'user_status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: params.value === 'Active' ? 'green' : 'red',
              marginRight: 5,
            }}
          />
          {params.value}
        </div>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div>
        <IconButton onClick={() => handleUpdateDialogOpen(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteChange(params.row.id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // ------------------------- LIST DATA FORMAT & FILTER FUNCTIONS
  const filteredUsers = userData.map(filter => ({
    ...filter,
    user_name: `${filter.user_lastName},\n ${filter.user_firstName}`,
  })).filter(filter => 
    filter.id.toString().includes(searchValue) ||
    filter.user_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    filter.user_mobileNumber.toString().includes(searchValue) ||
    filter.user_email.toLowerCase().includes(searchValue.toLowerCase()) ||
    filter.user_gender.toLowerCase().includes(searchValue.toLowerCase()) ||
    filter.user_role.toLowerCase().includes(searchValue.toLowerCase()) ||
    filter.user_status.toLowerCase().includes(searchValue.toLowerCase()) ||
    filter.user_createdAt.toLowerCase().includes(searchValue.toLowerCase())
);
// const formatYearFromDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
  //   const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
  //   return `${year}-${month}-${day}`;
  // };
  
  // ------------------------- BUTTON FUNCTIONS
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  const handleAddDialogOpen = () => {
    console.log('Open User Profile Form');
    setIsAddDialogOpen(true);
  };
  const handleUpdateDialogOpen = (id) => {
    if (id) {
      const selectedUser = userData.find((user) => user.id === id);
      setDialogInitialData(selectedUser);
      console.log(`Edit user with ID: ${selectedUser}`);
      console.log('Open User Profile Form');
    } else {
      // No user selected, clear the data
      setDialogInitialData(null);
    }
    setIsEditDialogOpen(true);
  };
  const handleDeleteChange = (id) => {
    setDeleteUserId(id);
    setIsDeleteDialogOpen(true);
    console.log(`Delete user with ID: ${id}`);
  };
  const handleDeleteConfirmation = () => {
    if (deleteUserId) {
      // Send an HTTP request to update user_status
      axios
        .patch(`http://localhost:5000/user-profile/${deleteUserId}`, { user_status: 'DELETED' })
        .then((response) => {
          if (response.status === 200) {
            // Update the UI by filtering out the deleted user
            const updatedUserProfile = userData.filter(
              (user) => user.id !== deleteUserId
            );
            setUserData(updatedUserProfile);
          }
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        })
        .finally(() => {
          setIsDeleteDialogOpen(false);
          setDeleteUserId(null);
        });
    }  
  };
  const handleDialogClose = () => {
    console.log('Close User Profile Form');
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    console.log('Clear User Initial Data');
    setDialogInitialData(null);
  };

  // ------------------------- FRONTEND FUNCTIONS
  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary" onClick={handleAddDialogOpen}>New User</Button>
       <div className="ml-2">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {/* -------------------- <DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this user?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirmation} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        {/* -------------------- DELETE CONFIRMATION DIALOG/> */}

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
      <AddDialog open={isAddDialogOpen} onClose={handleDialogClose} onCancel={handleDialogClose} />
      <EditDialog open={isEditDialogOpen} onClose={handleDialogClose} onCancel={handleDialogClose} initialData={dialogInitialData} key={dialogInitialData?.id || 'new'}/>
    </div>
    </div>
  );
};

export default UserProfileGrid;