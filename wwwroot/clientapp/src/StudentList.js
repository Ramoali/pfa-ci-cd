import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({ firstName: '', lastName: '', email: '', dateOfBirth: '' });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const response = await fetch('/api/Students');
        const data = await response.json();
        setStudents(data);
    };

    const handleOpen = (student = null) => {
        setCurrentStudent(student || { firstName: '', lastName: '', email: '', dateOfBirth: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        const method = currentStudent.studentId ? 'PUT' : 'POST';
        const url = currentStudent.studentId ? `/api/Students/${currentStudent.studentId}` : '/api/Students';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentStudent),
        });

        if (response.ok) {
            fetchStudents();
            handleClose();
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`/api/Students/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchStudents();
        }
    };

    // Helper function to format the date
    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid Date'; // Fallback for invalid or empty dates
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date'; // Check if the date is invalid
        return date.toLocaleDateString(); // Format the date as per the user's locale
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Add Student
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.studentId}>
                                <TableCell>{student.firstName}</TableCell>
                                <TableCell>{student.lastName}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{formatDate(student.dateOfBirth)}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(student)}>Edit</Button>
                                    <Button onClick={() => handleDelete(student.studentId)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
        </div>
    );
}

export default StudentList;