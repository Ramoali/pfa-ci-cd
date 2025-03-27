import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert, LinearProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { EmojiEvents, School, Group, TrendingUp, CheckCircle } from '@mui/icons-material';

function Dashboard() {
    const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [studentsResponse, coursesResponse, enrollmentsResponse] = await Promise.all([
                fetch('/api/Students'),
                fetch('/api/Courses'),
                fetch('/api/Enrollments'),
            ]);

            if (!studentsResponse.ok || !coursesResponse.ok || !enrollmentsResponse.ok) {
                throw new Error('Failed to fetch stats.');
            }

            const [students, courses, enrollments] = await Promise.all([
                studentsResponse.json(),
                coursesResponse.json(),
                enrollmentsResponse.json(),
            ]);

            setStats({
                students: students.length,
                courses: courses.length,
                enrollments: enrollments.length,
            });
        } catch (error) {
            console.error(error);
            setError('An error occurred while fetching stats. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const progressData = [
        { title: 'Student Enrollment', value: (stats.students / 100) * 100, goal: 100, icon: <Group fontSize="large" /> },
        { title: 'Course Completion', value: (stats.courses / 50) * 100, goal: 50, icon: <School fontSize="large" /> },
        { title: 'Enrollment Target', value: (stats.enrollments / 500) * 100, goal: 500, icon: <TrendingUp fontSize="large" /> },
    ];

    const chartData = [
        { name: 'Students', count: stats.students },
        { name: 'Courses', count: stats.courses },
        { name: 'Enrollments', count: stats.enrollments },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <Alert severity="error">{error}</Alert>
            </div>
        );
    }

    return (
        <div
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/image_portal.png.webp)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                padding: '20px',
            }}
        >
            {/* Overlay */}
            <div
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '10px',
                    padding: '20px',
                }}
            >
                {/* Welcome Message */}
                <Typography variant="h4" gutterBottom style={{ color: '#333', fontWeight: 'bold' }}>
                    Welcome back !
                </Typography>

                {/* Quick Stats Cards */}
                <Grid container spacing={3}>
                    {[
                        { title: 'Students', value: stats.students, onClick: () => navigate('/students'), icon: <Group fontSize="large" /> },
                        { title: 'Courses', value: stats.courses, onClick: () => navigate('/courses'), icon: <School fontSize="large" /> },
                        { title: 'Enrollments', value: stats.enrollments, onClick: () => navigate('/enrollments'), icon: <TrendingUp fontSize="large" /> },
                    ].map((item, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Card
                                    onClick={item.onClick}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <CardContent style={{ textAlign: 'center' }}>
                                        {item.icon}
                                        <Typography variant="h5" style={{ color: '#555', marginTop: '10px' }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="h3" style={{ color: '#333', fontWeight: 'bold' }}>
                                            {item.value}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Featured Highlights */}
                <Typography variant="h5" gutterBottom style={{ marginTop: '20px', color: '#333', fontWeight: 'bold' }}>
                    Featured Highlights
                </Typography>
                <Grid container spacing={3}>
                    {[
                        {
                            title: 'Top Performing Course',
                            description: 'React Basics has the highest enrollment rate.',
                            icon: <EmojiEvents fontSize="large" style={{ color: '#ff9800' }} />,
                        },
                        {
                            title: 'New Students',
                            description: '10 new students joined this month.',
                            icon: <Group fontSize="large" style={{ color: '#4caf50' }} />,
                        },
                        {
                            title: 'Enrollment Milestone',
                            description: 'Total enrollments crossed 500 this year.',
                            icon: <TrendingUp fontSize="large" style={{ color: '#2196f3' }} />,
                        },
                    ].map((highlight, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Card
                                    style={{
                                        backgroundColor: '#fff',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        padding: '20px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {highlight.icon}
                                    <Typography variant="h6" style={{ marginTop: '10px', color: '#333' }}>
                                        {highlight.title}
                                    </Typography>
                                    <Typography variant="body1" style={{ color: '#777' }}>
                                        {highlight.description}
                                    </Typography>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Progress Tracker */}
                <Typography variant="h5" gutterBottom style={{ marginTop: '20px', color: '#333', fontWeight: 'bold' }}>
                    Progress Tracker
                </Typography>
                <Grid container spacing={3}>
                    {progressData.map((progress, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Card
                                    style={{
                                        backgroundColor: '#fff',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        padding: '20px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {progress.icon}
                                    <Typography variant="h6" style={{ marginTop: '10px', color: '#333' }}>
                                        {progress.title}
                                    </Typography>
                                    <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                                        <CircularProgress
                                            variant="determinate"
                                            value={progress.value}
                                            size={80}
                                            thickness={5}
                                            style={{ color: '#6200ea' }}
                                        />
                                        <Box
                                            position="absolute"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                                {Math.round(progress.value)}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" style={{ color: '#777', marginTop: '10px' }}>
                                        {`${stats[progress.title.split(' ')[0].toLowerCase()]} / ${progress.goal}`}
                                    </Typography>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Chart */}
                <Typography variant="h5" gutterBottom style={{ marginTop: '20px', color: '#333', fontWeight: 'bold' }}>
                    Statistics
                </Typography>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <BarChart width={600} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#6200ea" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;