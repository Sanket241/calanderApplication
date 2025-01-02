import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    linkedinProfile: '',
    emails: '',
    phoneNumbers: '',
    comments: '',
    communicationPeriodicity: ''
  });

  const handleOpen = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData(company);
    } else {
      setEditingCompany(null);
      setFormData({
        name: '',
        location: '',
        linkedinProfile: '',
        emails: '',
        phoneNumbers: '',
        comments: '',
        communicationPeriodicity: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCompany(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCompany) {
      setCompanies(companies.map(company => 
        company.id === editingCompany.id ? { ...formData, id: company.id } : company
      ));
    } else {
      setCompanies([...companies, { ...formData, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setCompanies(companies.filter(company => company.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Company Management</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Company
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>LinkedIn Profile</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.location}</TableCell>
                <TableCell>{company.linkedinProfile}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(company)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(company.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCompany ? 'Edit Company' : 'Add Company'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Company Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="LinkedIn Profile"
              value={formData.linkedinProfile}
              onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Emails"
              value={formData.emails}
              onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Phone Numbers"
              value={formData.phoneNumbers}
              onChange={(e) => setFormData({ ...formData, phoneNumbers: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Comments"
              multiline
              rows={3}
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Communication Periodicity (in weeks)"
              type="number"
              value={formData.communicationPeriodicity}
              onChange={(e) => setFormData({ ...formData, communicationPeriodicity: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCompany ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyManagement;
