const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true,
        unique: true
    },
    homeTeam: {
        type: String,
        required: true
    },
    awayTeam: {
        type: String,
        required: true
    },
    matchDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['SCHEDULED', 'LIVE', 'FINISHED'],
        default: 'SCHEDULED'
    },
    score: {
        homeTeam: {
            type: Number,
            default: 0
        },
        awayTeam: {
            type: Number,
            default: 0
        }
    },
    result: {
        type: String,
        enum: ['HOME_WIN', 'AWAY_WIN', 'DRAW', null],
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Match', matchSchema); 