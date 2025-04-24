const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get leaderboard
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find()
            .select('username totalScore')
            .sort({ totalScore: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export leaderboard to Excel
router.get('/export', auth, async (req, res) => {
    try {
        const users = await User.find()
            .select('username totalScore')
            .sort({ totalScore: -1 });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Leaderboard');

        worksheet.columns = [
            { header: 'Rank', key: 'rank', width: 10 },
            { header: 'Username', key: 'username', width: 20 },
            { header: 'Total Score', key: 'totalScore', width: 15 }
        ];

        users.forEach((user, index) => {
            worksheet.addRow({
                rank: index + 1,
                username: user.username,
                totalScore: user.totalScore
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=leaderboard.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 