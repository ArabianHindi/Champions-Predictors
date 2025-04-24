const axios = require('axios');
const Match = require('../models/Match');

const fetchMatchesFromAPI = async () => {
    try {
        const response = await axios.get('https://api.football-data.org/v4/competitions/CL/matches?stage=SEMI_FINALS', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_API_KEY
            }
        });

        const matches = response.data.matches;
        
        for (const match of matches) {
            await Match.findOneAndUpdate(
                { matchId: match.id.toString() },
                {
                    matchId: match.id.toString(),
                    homeTeam: match.homeTeam.name,
                    awayTeam: match.awayTeam.name,
                    matchDate: new Date(match.utcDate),
                    status: match.status,
                    score: {
                        homeTeam: match.score.fullTime.home || 0,
                        awayTeam: match.score.fullTime.away || 0
                    },
                    result: match.score.winner ? 
                        (match.score.winner === 'HOME_TEAM' ? 'HOME_WIN' : 
                         match.score.winner === 'AWAY_TEAM' ? 'AWAY_WIN' : 'DRAW') : null
                },
                { upsert: true, new: true }
            );
        }

        return { success: true, message: 'Matches updated successfully' };
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw new Error('Failed to fetch matches from API');
    }
};

const calculatePoints = async (matchId) => {
    try {
        const match = await Match.findOne({ matchId });
        
        if (!match || !match.result) {
            throw new Error('Match result not available');
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

        return { success: true, message: 'Points calculated successfully' };
    } catch (error) {
        console.error('Error calculating points:', error);
        throw new Error('Failed to calculate points');
    }
};

module.exports = {
    fetchMatchesFromAPI,
    calculatePoints
}; 