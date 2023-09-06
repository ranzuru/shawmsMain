import React from 'react';
import StudentsProfileGrid from '../datagrid/StudentProfileGrid.js';
import { Typography } from '@mui/material';

const StudentsProfile = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow">
      <div className="bg-black h-24 flex items-center">
        <Typography variant="h1" sx={{ 
          fontSize: { xs: '2rem', sm: '2rem', md: '2.25rem' }, 
          fontWeight: 'bold', color: 'white', py: { xs: 3, md: 6 }, pl: 2 }}>
         Students Profile
        </Typography>
        </div>

        <div className="flex flex-col items-center justify-center h-full p-4 overflow-y-auto">
          <div className="flex items-center justify-center w-full">
            <StudentsProfileGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsProfile;
