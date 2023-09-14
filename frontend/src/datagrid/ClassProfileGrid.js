import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddDialog from '../forms/ClassAddDialog.js'
import EditDialog from '../forms/ClassEditDialog.js'
import axios from 'axios';

const ClassProfileGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [classData, setClassData] = useState([]);
  const [facultyData, setFacultyDataData] = useState([]);
  const [dialogInitialData, setDialogInitialData] = useState(null);
  
  // ------------------------- POPULATE LIST FUNCTIONS
  useEffect(() => {
    axios
      .get('http://localhost:5000/class-profile')
      .then((response) => {
        const databaseData = response.data.map((item) => ({
          id: item._id,
          class_grade: item.class_grade, 
          class_section: item.class_section,
          class_room: item.class_room,
          class_syFrom: item.class_syFrom,
          class_syTo: item.class_syTo,
          class_status: item.class_status,
          facl_employeeId: item.facl_employeeId,
          stud_createdAt: item.createdAt,
          stud_updatedAt: item.updatedAt,
        }));
        // Sort the data by 'stud_createdAt' in ascending order
        databaseData.sort((a, b) => new Date(b.stud_createdAt) - new Date(a.stud_createdAt));
        setClassData(databaseData);
      })
      .catch((error) => {
        console.error('Error fetching student profiles:', error);
      });
  }, []);

  // ------------------------- LIST FUNCTIONS
  const columns = [
    { field: 'id', headerName: 'ID', width: 250},
    { field: 'class_grade', headerName: 'Grade', width: 150},
    { field: 'class_section', headerName: 'Section', width: 150 },
    { field: 'class_room', headerName: 'Room', width: 100 },
    { field: 'class_sy', headerName: 'School Year', width: 150 },
    { field: 'facl_employeeId', headerName: 'Adviser Employee ID', width: 200 },
    {
      field: 'class_status',
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
      width: 100,
      renderCell: (params) => (
        <div>
        <IconButton onClick={() => handleUpdateDialogOpen(params.row.id)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // ------------------------- LIST DATA FORMAT & FILTER FUNCTIONS
  const filteredData = classData.map(modifiedData => ({
    ...modifiedData,
    class_sy: `${modifiedData.class_syFrom} - ${modifiedData.class_syTo}`,
  })).filter(data => 
    data.id.toString().includes(searchValue) ||
    data.class_grade.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.class_section.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.class_room.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.class_sy.includes(searchValue) ||
    data.class_status.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.facl_employeeId.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.stud_students.toLowerCase().includes(searchValue.toLowerCase()) 
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
    console.log('Open Student Profile Form');
    setIsAddDialogOpen(true);
  };
  const handleUpdateDialogOpen = (id) => {
    if (id) {
      const selectedClass = classData.find((data) => data.id === id);
      setDialogInitialData(selectedClass);
      console.log(`Edit user with ID: ${selectedClass}`);
      console.log('Open Student Profile Form');
    } else {
      // No user selected, clear the data
      setDialogInitialData(null);
    }
    setIsEditDialogOpen(true);
  };
  const handleDialogClose = () => {
    console.log('Close Student Profile Form');
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    console.log('Clear Student Initial Data');
    setDialogInitialData(null);
  };

  // ------------------------- FRONTEND FUNCTIONS
  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary" onClick={handleAddDialogOpen}>New Class</Button>
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
      rows={filteredData}
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

export default ClassProfileGrid;