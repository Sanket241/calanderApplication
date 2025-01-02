import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import CompanyManagement from './CompanyManagement';
import CommunicationMethodManagement from './CommunicationMethodManagement';

const AdminModule = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Company Management" />
          <Tab label="Communication Methods" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {value === 0 && <CompanyManagement />}
        {value === 1 && <CommunicationMethodManagement />}
      </Box>
    </Box>
  );
};

export default AdminModule;
