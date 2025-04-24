import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import getApiUrl from '../../utils/api';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    ButtonGroup,
    Alert,
    CircularProgress,
    Chip,
    Snackbar
} from '@mui/material';
import './Matches.css';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [predictions, setPredictions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchMatches();
        fetchPredictions();
    }, []);

    const fetchMatches = async () => {
        try {
            const response = await axios.get(getApiUrl('/api/matches'));
            setMatches(response.data);
        } catch (error) {
            setError('Failed to fetch matches');
        } finally {
            setLoading(false);
        }
    };

    const fetchPredictions = async () => {
        try {
            const response = await axios.get(getApiUrl('/api/predictions'));
            const predictionsMap = {};
            response.data.forEach(prediction => {
                predictionsMap[prediction.match.matchId] = prediction;
            });
            setPredictions(predictionsMap);
        } catch (error) {
            console.error('Failed to fetch predictions:', error);
        }
    };

    const handlePrediction = async (matchId, prediction) => {
        try {
            await axios.post(getApiUrl(`/api/predictions/${matchId}`), {
                prediction
            });
            setSuccessMessage('Prediction submitted successfully!');
            // Refresh predictions
            fetchPredictions();
        } catch (error) {
            setError('Failed to submit prediction');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SCHEDULED':
                return 'primary';
            case 'LIVE':
                return 'error';
            case 'FINISHED':
                return 'success';
            default:
                return 'default';
        }
    };

    const getPredictionButtonColor = (matchId, predictionType) => {
        const userPrediction = predictions[matchId];
        if (userPrediction && userPrediction.prediction === predictionType) {
            return 'success';
        }
        return 'primary';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="matches-bg">
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom 
                        sx={{ 
                            color: '#fff', 
                            fontWeight: 700, 
                            letterSpacing: 1,
                            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                width: '120px',
                                height: '4px',
                                background: 'linear-gradient(90deg, #42a5f5, #2196f3, transparent)',
                                borderRadius: '4px'
                            }
                        }}>
                        Champions League Matches
                    </Typography>
                    <Typography variant="subtitle1" 
                        sx={{ 
                            color: '#e0e0e0', 
                            mb: 4,
                            maxWidth: '760px',
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)' 
                        }}>
                        Predict the outcome of upcoming matches and compete on the leaderboard! 
                        <span style={{ color: '#90caf9', fontWeight: 500 }}>Voting is available for scheduled matches.</span>
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={4}>
                        {matches.map((match) => (
                            <Grid item xs={12} md={6} key={match._id}>
                                <Card className="match-card">
                                    <CardContent sx={{ padding: '20px' }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography variant="h6" className="match-title">
                                                <span style={{ color: '#1a237e' }}>{match.homeTeam}</span> 
                                                <span style={{ opacity: 0.7, fontWeight: 400, margin: '0 6px' }}>vs</span> 
                                                <span style={{ color: '#283593' }}>{match.awayTeam}</span>
                                            </Typography>
                                            <Chip
                                                label={match.status}
                                                color={getStatusColor(match.status)}
                                                size="small"
                                                className="match-status-chip"
                                                sx={{ minWidth: '90px', justifyContent: 'center' }}
                                            />
                                        </Box>
                                        <Typography color="textSecondary" gutterBottom sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            fontSize: '0.9rem',
                                            opacity: 0.8,
                                            '&::before': {
                                                content: '"📅"',
                                                marginRight: '8px',
                                                fontSize: '1.1rem'
                                            }
                                        }}>
                                            {new Date(match.matchDate).toLocaleString()}
                                        </Typography>
                                        {match.status === 'FINISHED' && (
                                            <Box mt={2} sx={{ 
                                                background: 'rgba(0,0,0,0.03)', 
                                                borderRadius: '8px', 
                                                padding: '12px',
                                                border: '1px solid rgba(0,0,0,0.08)' 
                                            }}>
                                                <Typography variant="body1" sx={{ 
                                                    fontWeight: 600, 
                                                    textAlign: 'center',
                                                    fontSize: '1.1rem',
                                                    margin: '0 0 8px 0'  
                                                }}>
                                                    <span style={{ color: '#1a237e', fontWeight: 700 }}>{match.score.homeTeam}</span>
                                                    <span style={{ margin: '0 15px', opacity: 0.6 }}>—</span>
                                                    <span style={{ color: '#283593', fontWeight: 700 }}>{match.score.awayTeam}</span>
                                                </Typography>
                                                {match.result && (
                                                    <Typography variant="body2" align="center" sx={{ 
                                                        color: match.result === 'HOME_WIN' ? '#1a237e' : match.result === 'AWAY_WIN' ? '#283593' : '#455a64',
                                                        fontWeight: 600,
                                                        fontSize: '0.9rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {match.result.replace('_', ' ')}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                        {predictions[match.matchId] && (
                                            <Box className="prediction-feedback">
                                                <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>🏆</span>
                                                    <span>
                                                        <b>Your prediction:</b> {predictions[match.matchId].prediction.replace('_', ' ')}
                                                    </span>
                                                </Typography>
                                                {predictions[match.matchId].points > 0 && (
                                                    <Typography variant="body2" color="success.main" sx={{ 
                                                        marginTop: '4px',
                                                        fontWeight: 600,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>✅</span>
                                                        Points earned: {predictions[match.matchId].points}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </CardContent>
                                    {match.status === 'SCHEDULED' && (
                                        <CardActions sx={{ padding: '16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                            <Box sx={{ width: '100%' }}>
                                                <Typography variant="subtitle2" sx={{ 
                                                    textAlign: 'center', 
                                                    marginBottom: '10px', 
                                                    color: '#303f9f',
                                                    fontWeight: 600,
                                                    fontSize: '0.85rem',
                                                    letterSpacing: '0.5px',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    Cast Your Vote
                                                </Typography>
                                                <ButtonGroup fullWidth variant="contained" sx={{ boxShadow: '0 3px 12px rgba(0,0,0,0.1)' }}>
                                                    <Button
                                                        className="prediction-btn"
                                                        onClick={() => handlePrediction(match.matchId, 'HOME_WIN')}
                                                        variant="contained"
                                                        color={getPredictionButtonColor(match.matchId, 'HOME_WIN')}
                                                        sx={{ 
                                                            py: 1.2,
                                                            borderRadius: '8px 0 0 8px',
                                                            borderRight: '1px solid rgba(255,255,255,0.1)'
                                                        }}
                                                    >
                                                        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🏠</span>
                                                            <span>Home Win</span>
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        className="prediction-btn"
                                                        onClick={() => handlePrediction(match.matchId, 'DRAW')}
                                                        variant="contained"
                                                        color={getPredictionButtonColor(match.matchId, 'DRAW')}
                                                        sx={{ 
                                                            py: 1.2,
                                                            borderRight: '1px solid rgba(255,255,255,0.1)',
                                                            borderLeft: '1px solid rgba(255,255,255,0.1)'
                                                        }}
                                                    >
                                                        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🤝</span>
                                                            <span>Draw</span>
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        className="prediction-btn"
                                                        onClick={() => handlePrediction(match.matchId, 'AWAY_WIN')}
                                                        variant="contained"
                                                        color={getPredictionButtonColor(match.matchId, 'AWAY_WIN')}
                                                        sx={{ 
                                                            py: 1.2,
                                                            borderRadius: '0 8px 8px 0',
                                                            borderLeft: '1px solid rgba(255,255,255,0.1)'
                                                        }}
                                                    >
                                                        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🛫</span>
                                                            <span>Away Win</span>
                                                        </span>
                                                    </Button>
                                                </ButtonGroup>
                                            </Box>
                                        </CardActions>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={3000}
                    onClose={() => setSuccessMessage('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={() => setSuccessMessage('')} 
                        severity="success" 
                        sx={{ 
                            width: '100%', 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            borderRadius: '8px',
                            fontWeight: 500,
                            '& .MuiAlert-icon': {
                                fontSize: '1.5rem'
                            }
                        }}
                    >
                        {successMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
};

export default Matches;