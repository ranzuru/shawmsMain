import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddDialog from '../forms/NutritionalStatusAddDialog.js'
import EditDialog from '../forms/NutritionalStatusEditDialog.js'
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

const StudentProfileGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [dialogInitialData, setDialogInitialData] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [studentProfileData, setStudentProfileData] = useState({});
  const [classProfileData, setClassProfileData] = useState({});
  
  // ------------------------- POPULATE LIST FUNCTIONS
  useEffect(() => {
    axios
      .get('http://localhost:5000/nutritional-status')
      .then((response) => {
        const databaseData = response.data.map((item) => ({
          id: item._id,
          nutr_weight: item.nutr_weight,
          nutr_height: item.nutr_height,
          nutr_height2: item.nutr_height2,
          nutr_bmi: item.nutr_bmi,
          nutr_bmiCategory: item.nutr_bmiCategory,
          nutr_hfa: item.nutr_hfa,
          nutr_remarks: item.nutr_remarks,
          nutr_type: item.nutr_type,
          stud_id: item.stud_id,
          class_id: item.class_id,
          stud_createdAt: item.createdAt,
          stud_updatedAt: item.updatedAt,
        }));
        setStudentData(databaseData);
      })
      .catch((error) => {
        console.error('Error fetching student profiles:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch class profile data for each unique stud_id
    const uniqueClassIds = [...new Set(studentData.map((student) => student.stud_id))];
  
    // Fetch class profile data for each unique stud_id
    const classProfileRequests = uniqueClassIds.map((classId) =>
      axios.get(`http://localhost:5000/student-profile/${classId}`)
    );
  
    Promise.all(classProfileRequests)
      .then((responses) => {
        // Organize class profile data into an object using stud_id as keys
        const classData = responses.reduce((classData, response, index) => {
          const classId = uniqueClassIds[index];
          classData[classId] = response.data; // Assuming your API response format
          return classData;
        }, {});
  
        setStudentProfileData(classData);
      })
      .catch((error) => {
        console.error('Error fetching class profiles:', error);
      });
  }, [studentData]);
  
  useEffect(() => {
    // Fetch class profile data for each unique stud_id
    const uniqueClassIds = [...new Set(studentData.map((student) => student.class_id))];
  
    // Fetch class profile data for each unique stud_id
    const classProfileRequests = uniqueClassIds.map((classId) =>
      axios.get(`http://localhost:5000/class-profile/${classId}`)
    );
  
    Promise.all(classProfileRequests)
      .then((responses) => {
        // Organize class profile data into an object using stud_id as keys
        const classData = responses.reduce((classData, response, index) => {
          const classId = uniqueClassIds[index];
          classData[classId] = response.data; // Assuming your API response format
          return classData;
        }, {});
  
        setClassProfileData(classData);
      })
      .catch((error) => {
        console.error('Error fetching class profiles:', error);
      });
  }, [studentData]);

  // ------------------------- LIST FUNCTIONS
  const columns = [
    { field: 'id', headerName: 'ID', width: 250},
    { field: 'stud_lrn', headerName: 'LRN', width: 250 },
    { field: 'stud_name', headerName: "Learner's Name", width: 250 },
    { field: 'stud_birthDate', headerName: 'Birthdate', width: 150 },
    { field: 'stud_age', headerName: 'Age', width: 100 },
    { field: 'nutr_weight', headerName: 'Weight (kg)', width: 150 },
    { field: 'nutr_height', headerName: 'Height (m)', width: 150 },
    { field: 'nutr_height2', headerName: 'Height² (m²)', width: 150 },
    { field: 'nutr_bmi', headerName: 'NS: BMI (kg/m²)', width: 150 },
    { field: 'nutr_bmiCategory', headerName: 'NS: BMI Category', width: 150 },
    { field: 'nutr_hfa', headerName: 'Height for Age (HFA)', width: 150 },
    { field: 'nutr_remarks', headerName: 'Remarks', width: 300 },
    { field: 'nutr_type', headerName: 'Type', width: 200 },
    { field: 'stud_class', headerName: 'Grade & Section', width: 200 },
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
  const filteredData = studentData.map((modifiedData) => {
    const studentProfile = studentProfileData[modifiedData.stud_id] || {};
    const classProfile = classProfileData[modifiedData.class_id] || {};
    return {
      ...modifiedData,
      stud_name: `${studentProfile.stud_lastName}, ${studentProfile.stud_firstName} ${studentProfile.stud_middleName}`,
      stud_age: `${studentProfile.stud_age}`,
      stud_lrn: `${studentProfile.stud_lrn}`,
      stud_birthDate: `${studentProfile.stud_birthDate}`,
      stud_class: `${classProfile.class_grade} - ${classProfile.class_section} (${classProfile.class_syFrom} - ${classProfile.class_syTo})`,
    };
  }).filter(data => 
    data.id.toString().includes(searchValue) ||
    data.nutr_weight.includes(searchValue.toLowerCase()) ||
    data.nutr_height.includes(searchValue.toLowerCase()) ||
    data.nutr_height2.includes(searchValue.toLowerCase()) ||
    data.nutr_bmi.includes(searchValue.toLowerCase()) ||
    data.nutr_bmiCategory.includes(searchValue.toLowerCase()) ||
    data.nutr_hfa.toLowerCase().includes(searchValue) ||
    data.nutr_remarks.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.nutr_type.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.stud_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.stud_age.includes(searchValue.toLowerCase()) ||
    data.stud_lrn.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.stud_birthDate.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.stud_class.toLowerCase().includes(searchValue.toLowerCase()) 
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
      const selectedStudent = studentData.find((student) => student.id === id);
      setDialogInitialData(selectedStudent);
      console.log(`Edit user with ID: ${selectedStudent}`);
      console.log('Open Student Profile Form');
    } else {
      // No user selected, clear the data
      setDialogInitialData(null);
    }
    setIsEditDialogOpen(true);
  };
  const handleDeleteChange = (id) => {
    setDeleteStudentId(id);
    setIsDeleteDialogOpen(true);
    console.log(`Delete student with ID: ${id}`);
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

export default StudentProfileGrid;