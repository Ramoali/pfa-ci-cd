import React from 'react';
import { Typography, Container, IconButton, Fab } from '@mui/material';
import { GitHub, LinkedIn, Twitter, ArrowUpward } from '@mui/icons-material';

function Footer() {
    // Function to scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Container
            style={{
                textAlign: 'center',
                marginTop: '50px',
                padding: '40px 20px',
                backgroundColor: '#f5f5f5',
                background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', // Gradient background
                position: 'relative',
                borderRadius: '10px 10px 0 0', // Rounded top corners
                boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
            }}
        >
            {/* Social Media Links */}
            <div style={{ marginBottom: '20px' }}>
                <IconButton
                    aria-label="GitHub"
                    href="https://github.com/Ramoali"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#333', margin: '0 10px' }}
                >
                    <GitHub fontSize="large" />
                </IconButton>
                <IconButton
                    aria-label="LinkedIn"
                    href="https://www.linkedin.com/in/omar-abouali/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0077b5', margin: '0 10px' }}
                >
                    <LinkedIn fontSize="large" />
                </IconButton>
                <IconButton
                    aria-label="Twitter"
                    href="https://x.com/OmarAboual98173"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1da1f2', margin: '0 10px' }}
                >
                    <Twitter fontSize="large" />
                </IconButton>
            </div>

            {/* Copyright Text */}
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: '10px' }}>
                &copy; 2025 Student Portal. All rights reserved to OOS.
            </Typography>

            {/* Back-to-Top Button */}
            <Fab
                color="primary"
                aria-label="Back to Top"
                onClick={scrollToTop}
                style={{
                    position: 'absolute',
                    top: '-24px',
                    right: '24px',
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                }}
            >
                <ArrowUpward />
            </Fab>
        </Container>
    );
}

export default Footer;