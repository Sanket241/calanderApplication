import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  CssBaseline,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard,
  Business,
  Menu as MenuIcon,
  Notifications,
  Assessment,
  Description as DescriptionIcon
} from '@mui/icons-material';
import AdminModule from './components/admin/AdminModule';
import UserModule from './components/user/UserModule';
import Analytics from './components/analytics/Analytics';
import Reports from './components/reports/Reports';
import { AppProvider } from './context/AppContext';
import { useNotifications } from './hooks/useNotifications';
import { theme } from './theme';
import './App.css';

function AppContent() {
  const [currentModule, setCurrentModule] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize notifications
  useNotifications();

  const handleModuleChange = (newValue) => {
    setCurrentModule(newValue);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const menuItems = [
    { icon: <Dashboard />, text: 'Dashboard', value: 0 },
    { icon: <Business />, text: 'Admin', value: 1 },
    { icon: <Assessment />, text: 'Analytics', value: 2 },
    { icon: <DescriptionIcon />, text: 'Reports', value: 3 }
  ];

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'grey.200'
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1,
              color: 'text.primary',
              fontWeight: 600
            }}
          >
            Communication Calendar
          </Typography>
          <IconButton color="primary">
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'grey.200'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleModuleChange(item.value)}
                selected={currentModule === item.value}
                sx={{
                  mb: 1,
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: currentModule === item.value ? 'primary.contrastText' : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: currentModule === item.value ? 600 : 400
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
          pt: { xs: 8, sm: 9 }
        }}
      >
        {currentModule === 0 && <UserModule />}
        {currentModule === 1 && <AdminModule />}
        {currentModule === 2 && <Analytics />}
        {currentModule === 3 && <Reports />}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
