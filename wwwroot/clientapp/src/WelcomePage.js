import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <Container style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h3" gutterBottom>
                Welcome to the Student Portal
            </Typography>
            <Typography variant="body1" gutterBottom>
                Manage students, courses, and enrollments with ease.
            </Typography>
            <div style={{ marginTop: '20px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/students')}
                    style={{ margin: '10px' }}
                >
                    Manage Students
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/courses')}
                    style={{ margin: '10px' }}
                >
                    Manage Courses
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate('/enrollments')}
                    style={{ margin: '10px' }}
                >
                    Manage Enrollments
                </Button>
            </div>
        </Container>
    );
}

export default WelcomePage;