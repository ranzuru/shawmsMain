import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddDialog from '../forms/FacultyAddDialog.js'
import EditDialog from '../forms/FacultyEditDialog.js'
import axios from 'axios';
import Dialog from '@mui/material/Dialog'; // Import the Dialog component
import DialogTitle from '@mui/material/DialogTitle'; // Import DialogTitle
import DialogContent from '@mui/material/DialogContent'; // Import DialogContent
import DialogContentText from '@mui/material/DialogContentText'; // Import DialogContentText
import DialogActions from '@mui/material/DialogActions'; //

const FacultyProfileGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [facultyData, setFacultyData] = useState([]);
  const [dialogInitialData, setDialogInitialData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
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
          facl_lastName: item.facl_lastName,
          facl_firstName: item.facl_firstName,
          facl_middleName: item.facl_middleName,
          facl_gender: item.facl_gender, 
          facl_mobileNumber: item.facl_mobileNumber, 
          facl_role: item.facl_role, 
          facl_status: item.facl_status,
          facl_profileCreated: item.createdAt,
          facl_profileUpdated: item.updatedAt,
        }));
        setFacultyData(modifiedData);
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

  const handleUpdateDialogOpen = (id) => {
    if (id) {
      const selectedUser = facultyData.find((user) => user.id === id);
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
    setDeleteId(id); // Set the student ID to delete
    setIsDeleteDialogOpen(true); // Open the confirmation dialog
    console.log(`Delete student with ID: ${id}`);
  };

  const handleDeleteConfirmation = () => {
    if (deleteId) {
      // Send an HTTP request to update faculty status
      axios
        .patch(`http://localhost:5000/faculty-profile/${deleteId}`, { stud_status: 'DELETED' })
        .then((response) => {
          if (response.status === 200) {
            // Update the UI by filtering out the deleted faculty
            const updatedFacultyProfile = facultyData.filter(
              (faculty) => faculty.id !== deleteId
            );
            setFacultyData(updatedFacultyProfile);
          }
        })
        .catch((error) => {
          console.error('Error deleting faculty:', error);
        })
        .finally(() => {
          setIsDeleteDialogOpen(false); // Close the confirmation dialog
          setDeleteId(null); // Reset the faculty ID
        });
    }  
  };

  const filteredFacultyProfile = facultyData.map(filter => ({
    ...filter,
    facl_name: `${filter.facl_lastName},\n ${filter.facl_firstName}\n ${filter.facl_middleName}`,

  })).filter(filter => 
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

  const handleDialogOpen = () => {
    console.log('Opening modal');
    setIsAddDialogOpen(true);
  };

  const handleDialogClose = () => {
    console.log('Close Student Profile Form');
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    console.log('Clear Student Initial Data');
    setDialogInitialData(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary" onClick={handleDialogOpen}>New Faculty</Button>
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
      <AddDialog open={isAddDialogOpen} onClose={handleDialogClose} onCancel={handleDialogClose} />
      <EditDialog open={isEditDialogOpen} onClose={handleDialogClose} onCancel={handleDialogClose} initialData={dialogInitialData} key={dialogInitialData?.id || 'new'}/>
    </div>
    </div>
  );
};

export default FacultyProfileGrid;