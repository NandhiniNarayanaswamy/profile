const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// GET /api/user/profile - Get profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

// PUT /api/user/profile - Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const updates = req.body;

        // Optional: Remove password if accidentally sent
        delete updates.password;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

module.exports = router;
