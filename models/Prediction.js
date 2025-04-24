const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    prediction: {
        type: String,
        enum: ['HOME_WIN', 'AWAY_WIN', 'DRAW'],
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure one prediction per user per match
predictionSchema.index({ user: 1, match: 1 }, { unique: true });

module.exports = mongoose.model('Prediction', predictionSchema); 