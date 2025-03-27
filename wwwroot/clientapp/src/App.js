import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy load components
const Dashboard = React.lazy(() => import('./Dashboard'));
const Students = React.lazy(() => import('./Students'));
const Courses = React.lazy(() => import('./Courses'));
const Enrollments = React.lazy(() => import('./Enrollments'));

const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
);

function AppRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route
                    path="/"
                    element={
                        <PageTransition>
                            <Dashboard />
                        </PageTransition>
                    }
                />
                <Route
                    path="/students"
                    element={
                        <PageTransition>
                            <Students />
                        </PageTransition>
                    }
                />
                <Route
                    path="/courses"
                    element={
                        <PageTransition>
                            <Courses />
                        </PageTransition>
                    }
                />
                <Route
                    path="/enrollments"
                    element={
                        <PageTransition>
                            <Enrollments />
                        </PageTransition>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <NavBar />
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></div>}>
                <AppRoutes />
            </Suspense>
            <Footer />
        </Router>
    );
}

export default App;