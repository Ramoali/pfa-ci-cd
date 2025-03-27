import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    Select, MenuItem, Snackbar, CircularProgress, IconButton, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';

function Enrollments() {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentEnrollment, setCurrentEnrollment] = useState({ studentId: '', courseId: '', enrollmentDate: '' });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchEnrollments();
        fetchStudents();
        fetchCourses();
    }, []);

    const fetchEnrollments = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/Enrollments');
            if (!response.ok) {
                throw new Error('Failed to fetch enrollments.');
            }
            const data = await response.json();
            setEnrollments(data);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'An error occurred while fetching enrollments.' });
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
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
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/Courses');
            if (!response.ok) {
                throw new Error('Failed to fetch courses.');
            }
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'An error occurred while fetching courses.' });
        }
    };

    const handleOpen = (enrollment = null) => {
        setCurrentEnrollment(enrollment || { studentId: '', courseId: '', enrollmentDate: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (!currentEnrollment.studentId || !currentEnrollment.courseId || !currentEnrollment.enrollmentDate) {
            setSnackbar({ open: true, message: 'Please fill in all fields.' });
            return;
        }

        try {
            const method = currentEnrollment.enrollmentId ? 'PUT' : 'POST';
            const url = currentEnrollment.enrollmentId ? `/api/Enrollments/${currentEnrollment.enrollmentId}` : '/api/Enrollments';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentEnrollment),
            });

            if (!response.ok) {
                throw new Error('Failed to save enrollment.');
            }

            fetchEnrollments();
            handleClose();
            setSnackbar({ open: true, message: 'Enrollment saved successfully.' });
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'An error occurred while saving the enrollment.' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enrollment?')) {
            try {
                const response = await fetch(`/api/Enrollments/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Failed to delete enrollment.');
                }
                fetchEnrollments();
                setSnackbar({ open: true, message: 'Enrollment deleted successfully.' });
            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: 'An error occurred while deleting the enrollment.' });
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Helper function to get student name by ID
    const getStudentName = (studentId) => {
        const student = students.find((s) => s.studentId === studentId);
        return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
    };

    // Helper function to get course name by ID
    const getCourseName = (courseId) => {
        const course = courses.find((c) => c.courseId === courseId);
        return course ? course.courseName : 'Unknown Course';
    };

    return (
        <div style={{ padding: '20px' }}>
            <Button variant="contained" color="primary" onClick={() => navigate('/')} style={{ margin: '10px' }}>
                Back to Home
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: '10px' }}>
                Add Enrollment
            </Button>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student</TableCell>
                                <TableCell>Course</TableCell>
                                <TableCell>Enrollment Date</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrollments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No enrollments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                enrollments.map((enrollment) => (
                                    <TableRow key={enrollment.enrollmentId} hover>
                                        <TableCell>{getStudentName(enrollment.studentId)}</TableCell>
                                        <TableCell>{getCourseName(enrollment.courseId)}</TableCell>
                                        <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleOpen(enrollment)}>
                                                    <Edit color="primary" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDelete(enrollment.enrollmentId)}>
                                                    <Delete color="error" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentEnrollment.enrollmentId ? 'Edit Enrollment' : 'Add Enrollment'}</DialogTitle>
                <DialogContent>
                    <Select
                        value={currentEnrollment.studentId}
                        onChange={(e) => setCurrentEnrollment({ ...currentEnrollment, studentId: e.target.value })}
                        fullWidth
                        margin="normal"
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Student</MenuItem>
                        {students.map((student) => (
                            <MenuItem key={student.studentId} value={student.studentId}>
                                {student.firstName} {student.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        value={currentEnrollment.courseId}
                        onChange={(e) => setCurrentEnrollment({ ...currentEnrollment, courseId: e.target.value })}
                        fullWidth
                        margin="normal"
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Course</MenuItem>
                        {courses.map((course) => (
                            <MenuItem key={course.courseId} value={course.courseId}>
                                {course.courseName}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Enrollment Date"
                        type="date"
                        value={currentEnrollment.enrollmentDate}
                        onChange={(e) => setCurrentEnrollment({ ...currentEnrollment, enrollmentDate: e.target.value })}
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

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbar.message}
            />
        </div>
    );
}

export default Enrollments;