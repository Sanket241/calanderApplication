import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
  Chip,
  Stack,
  Zoom,
  Fab,
  Autocomplete,
  Alert,
  Snackbar,
  useTheme,
  alpha
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add as AddIcon,
  Event as EventIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
  isAfter,
  isBefore
} from 'date-fns';
import { useApp } from '../../context/AppContext';
import { styled } from '@mui/material/styles';

const CalendarCell = styled(Box)(({ theme }) => ({
  height: '100%',
  minHeight: 120,
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.background.dark,
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4],
  },
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const DateText = styled(Typography)(({ theme, isToday }) => ({
  fontWeight: isToday ? 600 : 400,
  color: isToday ? theme.palette.primary.main : theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

const EventChip = styled(Chip)(({ theme, eventType }) => ({
  margin: '2px 0',
  backgroundColor: eventType === 'overdue' 
    ? theme.palette.error.light 
    : eventType === 'today'
    ? theme.palette.warning.light
    : theme.palette.primary.light,
  color: theme.palette.getContrastText(
    eventType === 'overdue'
      ? theme.palette.error.light
      : eventType === 'today'
      ? theme.palette.warning.light
      : theme.palette.primary.light
  ),
  '&:hover': {
    backgroundColor: eventType === 'overdue'
      ? theme.palette.error.main
      : eventType === 'today'
      ? theme.palette.warning.main
      : theme.palette.primary.main,
  },
}));

const CalendarView = () => {
  const theme = useTheme();
  const { state, actions } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [hoveredDay, setHoveredDay] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get communications for the current month
  const monthCommunications = state.communications.filter(comm => 
    isSameMonth(parseISO(comm.date), currentDate)
  );

  const getDayEvents = (day) => {
    return monthCommunications.filter(comm => 
      isSameDay(parseISO(comm.date), day)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDate(null);
    setSelectedCompany('');
    setSelectedMethod('');
    setNotes('');
  };

  const handleSubmit = () => {
    if (!selectedCompany || !selectedMethod) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    const newCommunication = {
      companyId: selectedCompany,
      type: selectedMethod,
      date: selectedDate.toISOString(),
      notes: notes,
      status: 'scheduled'
    };

    actions.addCommunication(newCommunication);
    setSnackbar({
      open: true,
      message: 'Communication scheduled successfully',
      severity: 'success'
    });
    handleCloseDialog();
  };

  const getEventColor = (event) => {
    const company = state.companies.find(c => c.id === event.companyId);
    if (!company) return theme.palette.grey[500];

    const today = new Date();
    const eventDate = parseISO(event.date);
    const dueDate = new Date(eventDate);
    dueDate.setDate(dueDate.getDate() + company.communicationPeriodicity);

    if (isAfter(today, dueDate)) {
      return theme.palette.error.main;
    } else if (isSameDay(today, dueDate)) {
      return theme.palette.warning.main;
    }
    return theme.palette.primary.main;
  };

  const renderDayContent = (day) => {
    const events = getDayEvents(day);
    const isCurrentMonth = isSameMonth(day, currentDate);
    const dayIsToday = isToday(day);
    const isHovered = hoveredDay && isSameDay(day, hoveredDay);

    return (
      <CalendarCell
        sx={{
          backgroundColor: dayIsToday 
            ? alpha(theme.palette.primary.main, 0.1)
            : isCurrentMonth 
              ? 'background.paper'
              : alpha(theme.palette.grey[200], 0.5),
          border: dayIsToday 
            ? `2px solid ${theme.palette.primary.main}`
            : '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            transform: 'scale(1.02)'
          }
        }}
        onClick={() => handleDateClick(day)}
        onMouseEnter={() => setHoveredDay(day)}
        onMouseLeave={() => setHoveredDay(null)}
      >
        <DateText theme={theme} isToday={dayIsToday}>
          {format(day, 'd')}
        </DateText>
        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
          {events.slice(0, 3).map((event, index) => {
            const company = state.companies.find(c => c.id === event.companyId);
            const eventType = getEventType(event);
            return (
              <Tooltip
                key={event.id || index}
                title={`${company?.name || 'Unknown'} - ${event.type}`}
                placement="top"
                TransitionComponent={Zoom}
              >
                <EventChip theme={theme} eventType={eventType}>
                  {company?.name || 'Unknown'}
                </EventChip>
              </Tooltip>
            );
          })}
          {events.length > 3 && (
            <Tooltip
              title={`${events.length - 3} more events`}
              placement="top"
              TransitionComponent={Zoom}
            >
              <Chip
                size="small"
                label={`+${events.length - 3}`}
                sx={{
                  backgroundColor: theme.palette.grey[500],
                  color: 'white',
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.7rem'
                  }
                }}
              />
            </Tooltip>
          )}
        </Stack>
      </CalendarCell>
    );
  };

  const getEventType = (event) => {
    const company = state.companies.find(c => c.id === event.companyId);
    if (!company) return 'unknown';

    const today = new Date();
    const eventDate = parseISO(event.date);
    const dueDate = new Date(eventDate);
    dueDate.setDate(dueDate.getDate() + company.communicationPeriodicity);

    if (isAfter(today, dueDate)) {
      return 'overdue';
    } else if (isSameDay(today, dueDate)) {
      return 'today';
    }
    return 'scheduled';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handlePreviousMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" sx={{ mx: 2 }}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>

        <Grid container spacing={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Grid item xs key={day}>
              <Typography
                variant="subtitle2"
                align="center"
                sx={{ fontWeight: 'bold', mb: 1 }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
          {daysInMonth.map((day, index) => (
            <Grid item xs key={day.toISOString()}>
              {renderDayContent(day)}
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleDateClick(new Date())}
      >
        <AddIcon />
      </Fab>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Schedule Communication
          {selectedDate && (
            <Typography variant="subtitle1" color="text.secondary">
              {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Company</InputLabel>
                <Select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  label="Company"
                >
                  {state.companies.map(company => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Communication Method</InputLabel>
                <Select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  label="Communication Method"
                >
                  {state.communicationMethods.map(method => (
                    <MenuItem key={method.id} value={method.name}>
                      {method.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CalendarView;
