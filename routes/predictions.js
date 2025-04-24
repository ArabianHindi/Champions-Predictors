const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Match = require('../models/Match');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get user's predictions
router.get('/', auth, async (req, res) => {
    try {
        const predictions = await Prediction.find({ user: req.user._id })
            .populate('match')
            .sort({ 'match.matchDate': 1 });
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create or update prediction
router.post('/:matchId', auth, async (req, res) => {
    try {
        const { matchId } = req.params;
        const { prediction } = req.body;

        // Check if match exists and hasn't started
        const match = await Match.findOne({ matchId });
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        if (match.status !== 'SCHEDULED') {
            return res.status(400).json({ error: 'Cannot predict on a match that has already started' });
        }

        // Create or update prediction
        const userPrediction = await Prediction.findOneAndUpdate(
            { user: req.user._id, match: match._id },
            { prediction, isLocked: false },
            { upsert: true, new: true }
        );

        res.json(userPrediction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Calculate points for a match
router.post('/calculate/:matchId', auth, async (req, res) => {
    try {
        const { matchId } = req.params;
        const match = await Match.findOne({ matchId });
        
        if (!match || !match.result) {
            return res.status(400).json({ error: 'Match result not available' });
        }

        const predictions = await Prediction.find({ match: match._id });
        
        for (const prediction of predictions) {
            let points = 0;
            
            if (prediction.prediction === match.result) {
                points = match.result === 'DRAW' ? 1 : 3;
            }
            
            prediction.points = points;
            prediction.isLocked = true;
            await prediction.save();

            // Update user's total score
            const user = await User.findById(prediction.user);
            user.totalScore += points;
            await user.save();
        }

        res.json({ message: 'Points calculated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 