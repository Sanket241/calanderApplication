import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import Dashboard from './Dashboard';
import CalendarView from './CalendarView';

const UserModule = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Dashboard" />
          <Tab label="Calendar View" />
        </Tabs>
      </Box>
      <Box>
        {value === 0 && <Dashboard />}
        {value === 1 && <CalendarView />}
      </Box>
    </Box>
  );
};

export default UserModule;
