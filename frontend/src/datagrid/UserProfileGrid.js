import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ManageUserForm from '../forms/UserProfileForm.js'
import axios from 'axios';

const UserProfileGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userProfile, setUserProfile] = useState([]);
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // const formatYearFromDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
  //   const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
  //   return `${year}-${month}-${day}`;
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-profile');
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
    // valueGetter: (params) => formatYearFromDate(params.row.createdAt),
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
        <IconButton onClick={() => handleAction(params.row._id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAction = (_id) => {
    // Implement your action logic here
    console.log(`Edit user with ID: ${_id}`);
  };

  const handleDelete = (_id) => {
    // Implement your delete logic here
    console.log(`Delete user with ID: ${_id}`);
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

  const handleFormOpen = () => {
    console.log('Open User Profile Form');
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    console.log('Close User Profile Form');
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary" onClick={handleFormOpen}>New User</Button>
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
      <ManageUserForm open={isFormOpen} onClose={handleFormClose} onCancel={handleFormClose} />
    </div>
    </div>
  );
};

export default UserProfileGrid;