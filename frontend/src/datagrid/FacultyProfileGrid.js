import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddDialog from '../forms/FacultyAddDialog.js'
import axios from 'axios';

const FaculyProfileGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [facultyProfile, setFacultyProfile] = useState([]);
  
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
    axios
      .get('http://localhost:5000/faculty-profile')
      .then((response) => {
        const modifiedData = response.data.map((item) => ({
          id: item._id,
          facl_employeeId: item.facl_employeeId, 
          facl_name: item.facl_lastName + ", " + item.facl_firstName + " " + item.facl_middleName,
          facl_gender: item.facl_gender, 
          facl_mobileNumber: item.facl_mobileNumber, 
          facl_role: item.facl_role, 
          facl_status: item.facl_status,
          facl_profileCreated: item.createdAt,
          facl_profileUpdated: item.updatedAt,
        }));
        setFacultyProfile(modifiedData);
      })
      .catch((error) => {
        console.error('Error fetching student profiles:', error);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'facl_employeeId', headerName: 'Employee ID', width: 200 },
    { field: 'facl_name', headerName: 'Name (Last, First Middle)', width: 300 },
    { field: 'facl_gender', headerName: 'Gender', width: 100 },
    { field: 'facl_mobileNumber', headerName: 'Mobile Number', width: 150 },
    { field: 'facl_role', headerName: 'Role', width: 200 },
    {
      field: 'facl_status',
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
    { field: 'facl_profileCreated', headerName: 'Created', width: 200 },
    { field: 'facl_profileUpdated', headerName: 'Updated', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div>
        <IconButton onClick={() => handleAction(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
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

  const filteredFacultyProfile = facultyProfile.filter(filter => 
    filter.id.toString().includes(searchValue) ||
    filter.facl_employeeId.toString().includes(searchValue) ||
    filter.facl_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    filter.facl_gender.toLowerCase().includes(searchValue.toLowerCase()) ||
    filter.facl_mobileNumber.includes(searchValue) ||
    filter.facl_role.toLowerCase().includes(searchValue.toLowerCase()) ||
    filter.facl_status.toLowerCase().includes(searchValue.toLowerCase()) || 
    filter.createdAt.includes(searchValue) || 
    filter.updatedAt.includes(searchValue)
  );

  const handleModalOpen = () => {
    console.log('Opening modal');
    setIsFormOpen(true);
  };

  const handleModalClose = () => {
    console.log('Closing modal');
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary" onClick={handleModalOpen}>New User</Button>
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
      rows={filteredFacultyProfile}
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
      <AddDialog open={isFormOpen} onClose={handleModalClose} onCancel={handleModalClose} />
    </div>
    </div>
  );
};

export default FaculyProfileGrid;