import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControl,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Select,
  MenuItem,
  Chip,
  Grid
} from '@mui/material';
import { useApp } from '../../context/AppContext';
import { TimePicker } from '@mui/x-date-pickers';

const Settings = () => {
  const { state, actions } = useApp();
  const [showSaveAlert, setShowSaveAlert] = React.useState(false);

  const handleSettingChange = (key, value) => {
    actions.updateSettings({ [key]: value });
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const workingDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Application Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.settings.notificationsEnabled}
                    onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                  />
                }
                label="Enable Browser Notifications"
              />
              <Typography variant="body2" color="text.secondary">
                Receive notifications for overdue and upcoming communications
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.settings.emailReminders}
                    onChange={(e) => handleSettingChange('emailReminders', e.target.checked)}
                  />
                }
                label="Enable Email Reminders"
              />
              <Typography variant="body2" color="text.secondary">
                Receive email reminders for communications
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Communication Settings
            </Typography>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Default Communication Period (days)"
                value={state.settings.defaultCommunicationPeriod}
                onChange={(e) => handleSettingChange('defaultCommunicationPeriod', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Default time period between communications for new companies
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Working Days
            </Typography>
            <Box sx={{ mb: 3 }}>
              {workingDays.map((day) => (
                <Chip
                  key={day}
                  label={day}
                  sx={{ m: 0.5 }}
                  color={state.settings.workingDays.includes(day) ? 'primary' : 'default'}
                  onClick={() => {
                    const newWorkingDays = state.settings.workingDays.includes(day)
                      ? state.settings.workingDays.filter(d => d !== day)
                      : [...state.settings.workingDays, day];
                    handleSettingChange('workingDays', newWorkingDays);
                  }}
                />
              ))}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Select the days when communications should be scheduled
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data Management
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  const data = JSON.stringify(state);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'communication-calendar-backup.json';
                  a.click();
                }}
              >
                Export Data
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Download a backup of all your data
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                id="import-data"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedData = JSON.parse(event.target.result);
                        actions.updateSettings(importedData.settings);
                        setShowSaveAlert(true);
                      } catch (error) {
                        console.error('Error importing data:', error);
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              <label htmlFor="import-data">
                <Button variant="outlined" color="primary" component="span">
                  Import Data
                </Button>
              </label>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Import data from a backup file
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {showSaveAlert && (
        <Alert
          severity="success"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999
          }}
        >
          Settings saved successfully
        </Alert>
      )}
    </Box>
  );
};

export default Settings;
