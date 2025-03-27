import React, { useEffect, useState } from 'react';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    Snackbar, CircularProgress, IconButton, Tooltip, Paper, Grid, Pagination, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({ courseName: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [page, setPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const navigate = useNavigate();

    const itemsPerPage = 6; // Number of courses per page

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (course = null) => {
        setCurrentCourse(course || { courseName: '', description: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (!currentCourse.courseName || !currentCourse.description) {
            setSnackbar({ open: true, message: 'Please fill in all fields.' });
            return;
        }

        try {
            const method = currentCourse.courseId ? 'PUT' : 'POST';
            const url = currentCourse.courseId ? `/api/Courses/${currentCourse.courseId}` : '/api/Courses';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentCourse),
            });

            if (!response.ok) {
                throw new Error('Failed to save course.');
            }

            fetchCourses();
            handleClose();
            setSnackbar({ open: true, message: 'Course saved successfully.' });
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'An error occurred while saving the course.' });
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/Courses/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete course.');
            }
            fetchCourses();
            setSnackbar({ open: true, message: 'Course deleted successfully.' });
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'An error occurred while deleting the course.' });
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const handleDeleteClick = (id) => {
        setCourseToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to the first page when searching
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const filteredCourses = courses
        .filter((course) =>
            course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.courseName.localeCompare(b.courseName);
            } else {
                return new Date(b.createdAt) - new Date(a.createdAt); // Assuming createdAt field exists
            }
        });

    const paginatedCourses = filteredCourses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            padding: '20px',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/')} style={{ margin: '10px' }}>
                    Back to Home
                </Button>
                <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ margin: '10px' }}>
                    Add Course
                </Button>

                {/* Search and Sort */}
                <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                    <TextField
                        label="Search Courses"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: <Search color="action" />,
                        }}
                    />
                    <FormControl variant="outlined" style={{ minWidth: '150px' }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="date">Date</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {paginatedCourses.map((course) => (
                                <Grid item xs={12} sm={6} md={4} key={course.courseId}>
                                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                                        <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px' }}>
                                            <h3>{course.courseName}</h3>
                                            <p>{course.description}</p>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                <Tooltip title="Edit">
                                                    <IconButton onClick={() => handleOpen(course)}>
                                                        <Edit color="primary" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton onClick={() => handleDeleteClick(course.courseId)}>
                                                        <Delete color="error" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                        {filteredCourses.length > itemsPerPage && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Pagination
                                    count={Math.ceil(filteredCourses.length / itemsPerPage)}
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                    color="primary"
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Add/Edit Course Dialog */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{currentCourse.courseId ? 'Edit Course' : 'Add Course'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Course Name"
                            value={currentCourse.courseName}
                            onChange={(e) => setCurrentCourse({ ...currentCourse, courseName: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            value={currentCourse.description}
                            onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Delete Course</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this course?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={() => handleDelete(courseToDelete)} color="error">
                            Delete
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
            </div>
        </div>
    );
}

export default Courses;