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
    const [classProfileData, setClassProfileData] = useState({});
    
    // ------------------------- POPULATE LIST FUNCTIONS
    useEffect(() => {
      axios
        .get('http://localhost:5000/student-profile')
        .then((response) => {
          const databaseData = response.data.map((item) => ({
            id: item._id,
            stud_lrn: item.stud_lrn,
            class_id: item.class_id, 
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
          setStudentData(databaseData);
        })
        .catch((error) => {
          console.error('Error fetching student profiles:', error);
        });
    }, []);

    useEffect(() => {
      // Fetch class profile data for each unique class_id
      const uniqueClassIds = [...new Set(studentData.map((student) => student.class_id))];
    
      // Fetch class profile data for each unique class_id
      const classProfileRequests = uniqueClassIds.map((classId) =>
        axios.get(`http://localhost:5000/class-profile/${classId}`)
      );
    
      Promise.all(classProfileRequests)
        .then((responses) => {
          // Organize class profile data into an object using class_id as keys
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
      { field: 'stud_lrn', headerName: 'LRN', width: 200},
      { field: 'class', headerName: 'Class', width: 300 },
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
        renderCell: (params) => {
          let statusColor = 'black'; // Default color
          switch (params.value) {
            case 'Enrolled':
              statusColor = 'green';
              break;
            case 'Not Enrolled':
              statusColor = 'red';
              break;
            case 'On Process':
              statusColor = 'orange';
              break;
            case 'Transferred':
              statusColor = 'blue';
              break;
            case 'Dropped':
              statusColor = 'grey';
              break;
            case 'Passed':
              statusColor = 'cyan';
              break;
            default:
              statusColor = 'black';
              break;
          }
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: statusColor,
                  marginRight: 5,
                }}
              />
              {params.value}
            </div>
          );
        },
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

    // ------------------------- LIST DATA FORMAT & FILTER FUNCTIONS
    const filteredData = studentData.map((modifiedData) => {
      const classProfile = classProfileData[modifiedData.class_id] || {}; // Default to an empty object if class profile data is not found
      return {
        ...modifiedData,
        stud_name: `${modifiedData.stud_lastName},\n ${modifiedData.stud_firstName}\n ${modifiedData.stud_middleName}`,
        stud_parent1: `${modifiedData.stud_parentName1},\n ${modifiedData.stud_parentMobile1}`,
        stud_parent2: `${modifiedData.stud_parentName2},\n ${modifiedData.stud_parentMobile2}`,
        class: `${classProfile.class_grade} - ${classProfile.class_section}\n(${classProfile.class_syFrom} - ${classProfile.class_syTo})`
      };
    }).filter(data => 
      data.id.toString().includes(searchValue) ||
      data.class_id.toString().includes(searchValue) ||
      data.stud_lrn.toLowerCase().includes(searchValue.toLowerCase()) ||
      data.stud_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      data.stud_gender.toLowerCase().includes(searchValue.toLowerCase()) ||
      data.stud_birthDate.includes(searchValue) ||
      data.stud_age.includes(searchValue) ||
      data.stud_4p.toLowerCase().includes(searchValue.toLowerCase()) ||
      data.stud_parent1.toLowerCase().includes(searchValue.toLowerCase()) ||
      data.stud_parent2.toLowerCase().includes(searchValue.toLowerCase()) ||
      data.stud_address.toLowerCase().includes(searchValue.toLowerCase()) ||
      data.stud_status.toLowerCase().includes(searchValue.toLowerCase())
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
    const handleDeleteConfirmation = () => {
      if (deleteStudentId) {
        // Send an HTTP request to update stud_status
        axios
          .patch(`http://localhost:5000/student-profile/${deleteStudentId}`, { stud_status: 'DELETED' })
          .then((response) => {
            if (response.status === 200) {
              // Update the UI by filtering out the deleted student
              const updatedData = studentData.filter(
                (student) => student.id !== deleteStudentId
              );
              setStudentData(updatedData);
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
        
        {/* -------------------- <DELETE CONFIRMATION DIALOG */}
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
          {/* -------------------- DELETE CONFIRMATION DIALOG/> */}

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