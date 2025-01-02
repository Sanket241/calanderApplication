import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Snackbar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { useApp } from '../../context/AppContext';

const Dashboard = () => {
  const theme = useTheme();
  const { state, actions, utils } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('nextCommunication');
  const [order, setOrder] = useState('asc');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [communicationType, setCommunicationType] = useState('');
  const [notes, setNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filteredCompanies = useMemo(() => {
    return state.companies
      .filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
        const status = utils.getCompanyStatus(company.id);
        
        switch (statusFilter) {
          case 'overdue':
            return matchesSearch && status.isOverdue;
          case 'today':
            return matchesSearch && status.isDueToday;
          default:
            return matchesSearch;
        }
      })
      .sort((a, b) => {
        const aComms = utils.getCompanyCommunications(a.id);
        const bComms = utils.getCompanyCommunications(b.id);
        const aDate = aComms.length > 0 ? parseISO(aComms[0].date) : new Date(0);
        const bDate = bComms.length > 0 ? parseISO(bComms[0].date) : new Date(0);

        if (orderBy === 'name') {
          return order === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          return order === 'asc'
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }
      });
  }, [state.companies, searchTerm, statusFilter, orderBy, order]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (company) => {
    setSelectedCompany(company);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCompany(null);
    setCommunicationType('');
    setNotes('');
  };

  const handleSubmitCommunication = () => {
    if (!communicationType) {
      setSnackbar({
        open: true,
        message: 'Please select a communication type',
        severity: 'error'
      });
      return;
    }

    const newCommunication = {
      companyId: selectedCompany.id,
      type: communicationType,
      date: new Date().toISOString(),
      notes: notes,
      status: 'completed'
    };

    actions.addCommunication(newCommunication);
    setSnackbar({
      open: true,
      message: 'Communication logged successfully',
      severity: 'success'
    });
    handleCloseDialog();
  };

  const getStatusColor = (company) => {
    const status = utils.getCompanyStatus(company.id);
    if (status.isOverdue) return theme.palette.error.main;
    if (status.isDueToday) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getStatusIcon = (company) => {
    const status = utils.getCompanyStatus(company.id);
    if (status.isOverdue) return <WarningIcon color="error" />;
    if (status.isDueToday) return <ScheduleIcon color="warning" />;
    return <CheckCircleIcon color="success" />;
  };

  const getNextCommunicationDate = (company) => {
    const communications = utils.getCompanyCommunications(company.id);
    if (communications.length === 0) return 'No communications';
    
    const lastComm = communications[0];
    const nextDate = new Date(parseISO(lastComm.date));
    nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity);
    
    return format(nextDate, 'MMM d, yyyy');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Companies
              </Typography>
              <Typography variant="h4">
                {state.companies.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overdue
              </Typography>
              <Typography variant="h4" color="error">
                {utils.getOverdueCommunications().length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Due Today
              </Typography>
              <Typography variant="h4" color="warning.main">
                {utils.getTodaysCommunications().length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Communications
              </Typography>
              <Typography variant="h4">
                {state.communications.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status Filter"
              >
                <MenuItem value="all">All Companies</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="today">Due Today</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Companies Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Company Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'nextCommunication'}
                  direction={orderBy === 'nextCommunication' ? order : 'asc'}
                  onClick={() => handleSort('nextCommunication')}
                >
                  Next Communication
                </TableSortLabel>
              </TableCell>
              <TableCell>Last Communication</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompanies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company) => {
                const communications = utils.getCompanyCommunications(company.id);
                const lastComm = communications[0];
                return (
                  <TableRow
                    key={company.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    <TableCell>
                      <Tooltip title={utils.getCompanyStatus(company.id).isOverdue ? 'Overdue' : utils.getCompanyStatus(company.id).isDueToday ? 'Due Today' : 'On Track'}>
                        {getStatusIcon(company)}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {company.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getNextCommunicationDate(company)}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getStatusColor(company), 0.1),
                          color: getStatusColor(company)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {lastComm ? (
                        <Stack spacing={0.5}>
                          <Typography variant="body2">
                            {format(parseISO(lastComm.date), 'MMM d, yyyy')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {lastComm.type}
                          </Typography>
                        </Stack>
                      ) : (
                        'No communications'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenDialog(company)}
                      >
                        Log Communication
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCompanies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Log Communication Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Log Communication
          {selectedCompany && (
            <Typography variant="subtitle1" color="text.secondary">
              {selectedCompany.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Communication Type</InputLabel>
                <Select
                  value={communicationType}
                  onChange={(e) => setCommunicationType(e.target.value)}
                  label="Communication Type"
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
          <Button onClick={handleSubmitCommunication} variant="contained" color="primary">
            Log Communication
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

export default Dashboard;
