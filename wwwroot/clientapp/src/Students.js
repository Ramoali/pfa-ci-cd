import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';

// Add a gradient background to the app
const backgroundStyle = {
    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', // Gradient background
    minHeight: '100vh', // Ensure the background covers the entire page
    padding: '20px', // Add some padding
};

function Students() {
    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({ firstName: '', lastName: '', email: '', dateOfBirth: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/Students');
            if (!response.ok) {
                throw new Error('Failed to fetch students.');
            }
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'An error occurred while fetching students.' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (student = null) => {
        setCurrentStudent(student || { firstName: '', lastName: '', email: '', dateOfBirth: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (!currentStudent.firstName || !currentStudent.lastName || !currentStudent.email || !currentStudent.dateOfBirth) {
            setSnackbar({ open: true, message: 'Please fill in all fields.' });
            return;
        }

        try {
            const method = currentStudent.studentId ? 'PUT' : 'POST';
            const url = currentStudent.studentId ? `/api/Students/${currentStudent.studentId}` : '/api/Students';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentStudent),
            });

            if (!response.ok) {
                throw new Error('Failed to save student.');
            }

            fetchStudents();
            handleClose();
            setSnackbar({ open: true, message: 'Student saved successfully.' });
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'An error occurred while saving the student.' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await fetch(`/api/Students/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Failed to delete student.');
                }
                fetchStudents();
                setSnackbar({ open: true, message: 'Student deleted successfully.' });
            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: 'An error occurred while deleting the student.' });
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const filteredStudents = students
        .filter((student) =>
            student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.firstName.localeCompare(b.firstName);
            } else {
                return b.firstName.localeCompare(a.firstName);
            }
        });

    const columns = [
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150, type: 'date', valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <div>
                    <Button
                        onClick={() => handleOpen(params.row)}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}
                        whileHover={{ scale: 1.1 }} // Add hover animation
                        whileTap={{ scale: 0.9 }} // Add tap animation
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(params.row.studentId)}
                        variant="contained"
                        color="secondary"
                        whileHover={{ scale: 1.1 }} // Add hover animation
                        whileTap={{ scale: 0.9 }} // Add tap animation
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div style={backgroundStyle}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Container>
                    <Typography variant="h4" gutterBottom style={{ paddingTop: '20px' }}>
                        Students
                    </Typography>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <TextField
                            label="Search Students"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </motion.div>

                    {/* Sort Order Selector */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Sort Order</InputLabel>
                            <Select
                                value={sortOrder}
                                onChange={handleSortChange}
                                label="Sort Order"
                            >
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </motion.div>

                    {/* Add Student Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpen()}
                            style={{ marginBottom: '20px' }}
                            whileHover={{ scale: 1.1 }} // Add hover animation
                            whileTap={{ scale: 0.9 }} // Add tap animation
                        >
                            Add Student
                        </Button>
                    </motion.div>

                    {/* DataGrid Table */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={filteredStudents}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    disableSelectionOnClick
                                    getRowId={(row) => row.studentId}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Add/Edit Student Dialog */}
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>{currentStudent.studentId ? 'Edit Student' : 'Add Student'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="First Name"
                                value={currentStudent.firstName}
                                onChange={(e) => setCurrentStudent({ ...currentStudent, firstName: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Last Name"
                                value={currentStudent.lastName}
                                onChange={(e) => setCurrentStudent({ ...currentStudent, lastName: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                value={currentStudent.email}
                                onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Date of Birth"
                                type="date"
                                value={currentStudent.dateOfBirth}
                                onChange={(e) => setCurrentStudent({ ...currentStudent, dateOfBirth: e.target.value })}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleSave} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Snackbar for Notifications */}
                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                        message={snackbar.message}
                    />
                </Container>
            </motion.div>
        </div>
    );
}

export default Students;