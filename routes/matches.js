const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { auth, adminAuth } = require('../middleware/auth');
const { fetchMatchesFromAPI, calculatePoints } = require('../services/matchService');

// Get all matches
router.get('/', auth, async (req, res) => {
    try {
        const matches = await Match.find().sort({ matchDate: 1 });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch matches from API (admin only)
router.post('/fetch', adminAuth, async (req, res) => {
    try {
        const result = await fetchMatchesFromAPI();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update match result (admin only)
router.patch('/:matchId', adminAuth, async (req, res) => {
    try {
        const { matchId } = req.params;
        const { result } = req.body;

        const match = await Match.findOneAndUpdate(
            { matchId },
            { result },
            { new: true }
        );

        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // Calculate points for all predictions
        await calculatePoints(matchId);

        res.json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 