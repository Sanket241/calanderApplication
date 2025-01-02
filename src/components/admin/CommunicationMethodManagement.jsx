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
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const defaultMethods = [
  { id: 1, name: 'LinkedIn Post', description: 'Post on company LinkedIn page', sequence: 1, mandatory: false },
  { id: 2, name: 'LinkedIn Message', description: 'Direct message on LinkedIn', sequence: 2, mandatory: false },
  { id: 3, name: 'Email', description: 'Email communication', sequence: 3, mandatory: false },
  { id: 4, name: 'Phone Call', description: 'Direct phone call', sequence: 4, mandatory: false },
  { id: 5, name: 'Other', description: 'Other communication methods', sequence: 5, mandatory: false }
];

const CommunicationMethodManagement = () => {
  const [methods, setMethods] = useState(defaultMethods);
  const [open, setOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sequence: '',
    mandatory: false
  });

  const handleOpen = (method = null) => {
    if (method) {
      setEditingMethod(method);
      setFormData(method);
    } else {
      setEditingMethod(null);
      setFormData({
        name: '',
        description: '',
        sequence: methods.length + 1,
        mandatory: false
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMethod(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMethod) {
      setMethods(methods.map(method =>
        method.id === editingMethod.id ? { ...formData, id: method.id } : method
      ));
    } else {
      setMethods([...methods, { ...formData, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setMethods(methods.filter(method => method.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Communication Method Management</h2>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Method
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sequence</TableCell>
              <TableCell>Mandatory</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {methods.sort((a, b) => a.sequence - b.sequence).map((method) => (
              <TableRow key={method.id}>
                <TableCell>{method.name}</TableCell>
                <TableCell>{method.description}</TableCell>
                <TableCell>{method.sequence}</TableCell>
                <TableCell>{method.mandatory ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(method)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(method.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingMethod ? 'Edit Communication Method' : 'Add Communication Method'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Method Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Sequence"
              type="number"
              value={formData.sequence}
              onChange={(e) => setFormData({ ...formData, sequence: parseInt(e.target.value) })}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.mandatory}
                  onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                />
              }
              label="Mandatory"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMethod ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunicationMethodManagement;
