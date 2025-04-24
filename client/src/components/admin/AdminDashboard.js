import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Alert,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';

const AdminDashboard = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchMatches();
        }
    }, [user]);

    const fetchMatches = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/matches');
            setMatches(response.data);
        } catch (error) {
            setError('Failed to fetch matches');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchMatches = async () => {
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/matches/fetch');
            await fetchMatches();
        } catch (error) {
            setError('Failed to fetch matches from API');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateResult = async (matchId, result) => {
        try {
            await axios.patch(`http://localhost:5000/api/matches/${matchId}`, { result });
            await fetchMatches();
        } catch (error) {
            setError('Failed to update match result');
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Alert severity="error">Access denied. Admin only.</Alert>
                </Box>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">
                        Admin Dashboard
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFetchMatches}
                        disabled={loading}
                    >
                        Fetch Latest Matches
                    </Button>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Grid container spacing={3}>
                    {matches.map((match) => (
                        <Grid item xs={12} md={6} key={match._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {match.homeTeam} vs {match.awayTeam}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        {new Date(match.matchDate).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Status: {match.status}
                                    </Typography>
                                    {match.status === 'FINISHED' && (
                                        <Typography variant="body2" color="textSecondary">
                                            Score: {match.score.homeTeam} - {match.score.awayTeam}
                                        </Typography>
                                    )}
                                </CardContent>
                                {match.status === 'FINISHED' && !match.result && (
                                    <CardActions>
                                        <FormControl fullWidth>
                                            <InputLabel>Update Result</InputLabel>
                                            <Select
                                                value=""
                                                onChange={(e) => handleUpdateResult(match.matchId, e.target.value)}
                                                label="Update Result"
                                            >
                                                <MenuItem value="HOME_WIN">Home Win</MenuItem>
                                                <MenuItem value="AWAY_WIN">Away Win</MenuItem>
                                                <MenuItem value="DRAW">Draw</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default AdminDashboard; 