import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    CircularProgress
} from '@mui/material';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Matches from './components/matches/Matches';
import Leaderboard from './components/leaderboard/Leaderboard';
import AdminDashboard from './components/admin/AdminDashboard';

const Navigation = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Champions League Predictors
                </Typography>
                {user ? (
                    <>
                        <Button color="inherit" href="/matches">
                            Matches
                        </Button>
                        <Button color="inherit" href="/leaderboard">
                            Leaderboard
                        </Button>
                        {user.role === 'admin' && (
                            <Button color="inherit" href="/admin">
                                Admin
                            </Button>
                        )}
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" href="/login">
                            Login
                        </Button>
                        <Button color="inherit" href="/register">
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return user && user.role === 'admin' ? children : <Navigate to="/matches" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navigation />
                <Container>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/matches"
                            element={
                                <PrivateRoute>
                                    <Matches />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/leaderboard"
                            element={
                                <PrivateRoute>
                                    <Leaderboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/matches" />} />
                    </Routes>
                </Container>
            </Router>
        </AuthProvider>
    );
};

export default App;
