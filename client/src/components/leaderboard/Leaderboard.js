import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/leaderboard');
            setUsers(response.data);
        } catch (error) {
            setError('Failed to fetch leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/leaderboard/export', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'leaderboard.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError('Failed to export leaderboard');
        }
    };

    const columns = [
        { field: 'rank', headerName: 'Rank', width: 100 },
        { field: 'username', headerName: 'Username', width: 200 },
        { field: 'totalScore', headerName: 'Total Score', width: 150 }
    ];

    const rows = users.map((user, index) => ({
        id: user._id,
        rank: index + 1,
        username: user.username,
        totalScore: user.totalScore
    }));

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
                        Leaderboard
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleExport}
                    >
                        Export to Excel
                    </Button>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Paper elevation={3}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        autoHeight
                    />
                </Paper>
            </Box>
        </Container>
    );
};

export default Leaderboard; 