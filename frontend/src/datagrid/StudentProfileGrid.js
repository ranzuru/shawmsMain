import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ManageUserForm from '../forms/StudentProfileForm.js'
import axios from 'axios';

const StudentProfileGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState([]);
  
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
      .get('http://localhost:5000/student-profile')
      .then((response) => {
        const modifiedData = response.data.map((item) => ({
          id: item._id,
          stud_lrn: item.stud_lrn, 
          stud_name: item.stud_lastName + ",\n" + item.stud_firstName + "\n" + item.stud_middleName,
          stud_gender: item.stud_gender,
          stud_mobileNumber: item.stud_mobileNumber, 
          stud_birthDate: item.stud_birthDate, 
          stud_age: item.stud_age,
          stud_4p: item.stud_4p,
          stud_parent1: item.stud_parentName1 + "\n" + item.stud_parentMobile1,
          stud_parent2: item.stud_parentName2 + "\n" + item.stud_parentMobile2,
          stud_address: item.stud_address,
          stud_status: item.stud_status,
          stud_createdAt: item.createdAt,
          stud_updatedAt: item.updatedAt,
        }));
        setStudentProfile(modifiedData);
      })
      .catch((error) => {
        console.error('Error fetching student profiles:', error);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 200},
    { field: 'stud_lrn', headerName: 'LRN', width: 200},
    { field: 'stud_name', headerName: 'Name (Last, First Middle)', width: 250 },
    { field: 'stud_gender', headerName: 'Gender', width: 150 },
    { field: 'stud_birthDate', headerName: 'Birth Date', width: 150 },
    { field: 'stud_age', headerName: 'Age', width: 75 },
    { field: 'stud_4p', headerName: '4P', width: 75 },
    { field: 'stud_parent1', headerName: 'Parent 1', width: 300 },
    { field: 'stud_parent2', headerName: 'Parent 2', width: 300 },
    { field: 'stud_address', headerName: 'Address', width: 150 },
    {
      field: 'stud_status',
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
    { field: 'stud_createdAt', headerName: 'Created', width: 200 },
    { field: 'stud_updatedAt', headerName: 'Updated', width: 200 },
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

  const filteredStudentProfile = studentProfile.filter(student => 
    student.id.toString().includes(searchValue) ||
    student.stud_lrn.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_mobileNumber.toString().includes(searchValue) ||
    student.stud_section.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_grade.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_gender.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_status.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleFormOpen = () => {
    console.log('Open Student Profile Form');
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    console.log('Close Student Profile Form');
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
      rows={filteredStudentProfile}
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

export default StudentProfileGrid;