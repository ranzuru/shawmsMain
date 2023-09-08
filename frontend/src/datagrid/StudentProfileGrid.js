import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddDialog from '../forms/StudentAddDialog.js'
import EditDialog from '../forms/StudentEditDialog.js'
import axios from 'axios';
import Dialog from '@mui/material/Dialog'; // Import the Dialog component
import DialogTitle from '@mui/material/DialogTitle'; // Import DialogTitle
import DialogContent from '@mui/material/DialogContent'; // Import DialogContent
import DialogContentText from '@mui/material/DialogContentText'; // Import DialogContentText
import DialogActions from '@mui/material/DialogActions'; //

const StudentProfileGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState([]);
  const [dialogInitialData, setDialogInitialData] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  const handleAddDialogOpen = () => {
    console.log('Open Student Profile Form');
    setIsAddDialogOpen(true);
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
          stud_firstName: item.stud_firstName,
          stud_middleName: item.stud_middleName,
          stud_lastName: item.stud_lastName,
          stud_gender: item.stud_gender,
          stud_birthDate: item.stud_birthDate, 
          stud_age: item.stud_age,
          stud_4p: item.stud_4p,
          stud_parentName1: item.stud_parentName1,
          stud_parentMobile1: item.stud_parentMobile1,
          stud_parentName2: item.stud_parentName2,
          stud_parentMobile2: item.stud_parentMobile2,
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
    { field: 'stud_name', headerName: 'Name', width: 250 },
    { field: 'stud_gender', headerName: 'Gender', width: 150 },
    { field: 'stud_birthDate', headerName: 'Birth Date', width: 150 },
    { field: 'stud_age', headerName: 'Age', width: 75 },
    { field: 'stud_4p', headerName: '4P', width: 75, renderCell: (params) => (
      <div>
        {params.value ? 'Yes' : 'No'}
      </div>
    ), },
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

  const filteredStudentProfile = studentProfile.map(student => ({
    ...student,
    stud_name: `${student.stud_lastName},\n ${student.stud_firstName}\n ${student.stud_middleName}`,
    stud_parent1: `${student.stud_parentName1},\n ${student.stud_parentMobile1}`,
    stud_parent2: `${student.stud_parentName2},\n ${student.stud_parentMobile2}`,
  })).filter(student => 
    student.id.toString().includes(searchValue) ||
    student.stud_lrn.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_gender.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_birthDate.includes(searchValue) ||
    student.stud_age.includes(searchValue) ||
    student.stud_4p.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_parent1.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_parent2.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_address.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.stud_status.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleUpdateDialogOpen = (id) => {
    if (id) {
      const selectedUser = studentProfile.find((user) => user.id === id);
      setDialogInitialData(selectedUser);
      console.log(`Edit user with ID: ${selectedUser}`);
      console.log('Open Student Profile Form');
    } else {
      // No user selected, clear the data
      setDialogInitialData(null);
    }
    setIsEditDialogOpen(true);
  };
  const handleDeleteChange = (id) => {
    setDeleteStudentId(id); // Set the student ID to delete
    setIsDeleteDialogOpen(true); // Open the confirmation dialog
    console.log(`Delete user with ID: ${id}`);
  };
  const handleFormClose = () => {
    console.log('Close Student Profile Form');
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    console.log('Clear Student Initial Data');
    setDialogInitialData(null);
  };

  const handleDeleteConfirmation = () => {
    if (deleteStudentId) {
      // Send an HTTP request to update stud_status
      axios
        .patch(`http://localhost:5000/student-profile/${deleteStudentId}`, { stud_status: 'DELETED' })
        .then((response) => {
          if (response.status === 200) {
            // Update the UI by filtering out the deleted student
            const updatedStudentProfile = studentProfile.filter(
              (student) => student.id !== deleteStudentId
            );
            setStudentProfile(updatedStudentProfile);
          }
        })
        .catch((error) => {
          console.error('Error deleting student:', error);
        })
        .finally(() => {
          setIsDeleteDialogOpen(false); // Close the confirmation dialog
          setDeleteStudentId(null); // Reset the student ID
        });
    }
    
  };

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
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this student?
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
      <AddDialog open={isAddDialogOpen} onClose={handleFormClose} onCancel={handleFormClose} />
      <EditDialog open={isEditDialogOpen} onClose={handleFormClose} onCancel={handleFormClose} initialData={dialogInitialData} key={dialogInitialData?.id || 'new'}/>
    </div>
    </div>
  );
};

export default StudentProfileGrid;