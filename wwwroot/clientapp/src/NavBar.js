import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';

function NavBar() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleMenuClose();
    };

    return (
        <AppBar position="static" style={{ background: '#3f51b5' }}>
            <Toolbar>
                {/* Logo and Title */}
                <SchoolIcon style={{ marginRight: '10px' }} />
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Student Portal
                </Typography>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <>
                        <Button color="inherit" onClick={() => navigate('/')}>
                            Home
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/students')}>
                            Students
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/courses')}>
                            Courses
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/enrollments')}>
                            Enrollments
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    </>
                )}

                {/* Mobile Navigation */}
                {isMobile && (
                    <>
                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => handleNavigation('/')}>Home</MenuItem>
                            <MenuItem onClick={() => handleNavigation('/students')}>Students</MenuItem>
                            <MenuItem onClick={() => handleNavigation('/courses')}>Courses</MenuItem>
                            <MenuItem onClick={() => handleNavigation('/enrollments')}>Enrollments</MenuItem>
                            <MenuItem onClick={() => handleNavigation('/login')}>Login</MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;