import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddDialog from '../forms/DengueAddDialog.js'
import EditDialog from '../forms/DengueEditDialog.js'
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
  const [facultyProfileData, setFacultyProfileData] = useState({});
  
  // ------------------------- POPULATE LIST FUNCTIONS
  useEffect(() => {
    axios
      .get('http://localhost:5000/dengue-monitoring')
      .then((response) => {
        const databaseData = response.data.map((item) => ({
          id: item._id,
          deng_onsetDate: item.deng_onsetDate,
          deng_admissionDate: item.deng_admissionDate,
          deng_admissionHospital: item.deng_admissionHospital,
          deng_dischargeDate: item.deng_dischargeDate,
          stud_id: item.stud_id,
          class_id: item.class_id,
          facl_id: item.facl_id,
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

  useEffect(() => {
    // Fetch class profile data for each unique stud_id
    const uniqueClassIds = [...new Set(studentData.map((student) => student.facl_id))];
  
    // Fetch class profile data for each unique stud_id
    const classProfileRequests = uniqueClassIds.map((classId) =>
      axios.get(`http://localhost:5000/faculty-profile/${classId}`)
    );
  
    Promise.all(classProfileRequests)
      .then((responses) => {
        // Organize class profile data into an object using stud_id as keys
        const classData = responses.reduce((classData, response, index) => {
          const classId = uniqueClassIds[index];
          classData[classId] = response.data; // Assuming your API response format
          return classData;
        }, {});
  
        setFacultyProfileData(classData);
      })
      .catch((error) => {
        console.error('Error fetching class profiles:', error);
      });
  }, [studentData]);

  // ------------------------- LIST FUNCTIONS
  const columns = [
    { field: 'id', headerName: 'ID', width: 250},
    { field: 'stud_name', headerName: 'Name of Pupil', width: 250 },
    { field: 'stud_age', headerName: 'Age', width: 100 },
    { field: 'stud_class', headerName: 'Grade & Section', width: 250 },
    { field: 'stud_adviser', headerName: 'Adviser', width: 250 },
    { field: 'deng_onsetDate', headerName: 'Date of Onset', width: 150 },
    { field: 'deng_admissionDate', headerName: 'Date of Admission', width: 150 },
    { field: 'deng_admissionHospital', headerName: 'Hospital of Admission', width: 300 },
    { field: 'deng_dischargeDate', headerName: 'Date of Discharge', width: 150 },
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
    const facultyProfile = facultyProfileData[modifiedData.facl_id] || {}; // Default to an empty object if class profile data is not found
    return {
      ...modifiedData,
      stud_name: `${studentProfile.stud_lastName}, ${studentProfile.stud_firstName} ${studentProfile.stud_middleName}`,
      stud_age: `${studentProfile.stud_age}`,
      stud_class: `${classProfile.class_grade} - ${classProfile.class_section} (${classProfile.class_syFrom} - ${classProfile.class_syTo})`,
      stud_adviser: `${facultyProfile.facl_lastName}, ${facultyProfile.facl_firstName} ${facultyProfile.facl_middleName}`,
    };
  }).filter(data => 
    data.id.toString().includes(searchValue) ||
    data.deng_onsetDate.toString().includes(searchValue) ||
    data.deng_admissionDate.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.deng_admissionHospital.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.deng_dischargeDate.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.stud_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.stud_age.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.stud_class.toLowerCase().includes(searchValue.toLowerCase()) ||
    data.stud_adviser.toLowerCase().includes(searchValue.toLowerCase())
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