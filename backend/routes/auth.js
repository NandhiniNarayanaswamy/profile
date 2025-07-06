const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redisClient = require('../config/redis');

// Utility: Validate email
const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.(com|in)$/.test(email.toLowerCase());

// Utility: Validate contact number
const isContactValid = (contact) => /^\d{10}$/.test(contact);

// Utility: Validate password strength
const isPasswordStrong = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password);

// Utility: Validate age from dob
const isValidDOB = (dob, age) => {
    const birth = new Date(dob);
    const today = new Date();
    const ageDiff = today.getFullYear() - birth.getFullYear();
    return birth < today && parseInt(age) >= 13 && parseInt(age) === ageDiff;
};

// POST /signup
router.post('/signup', async (req, res) => {
    try {
        let { name, email, password, age, dob, contact } = req.body;
        email = email.toLowerCase();

        if (!isEmailValid(email)) return res.status(400).json({ message: 'Invalid email format' });
        if (!isContactValid(contact)) return res.status(400).json({ message: 'Contact must be 10 digits' });
        if (!isPasswordStrong(password)) return res.status(400).json({ message: 'Weak password' });
        if (!isValidDOB(dob, age)) return res.status(400).json({ message: 'Invalid DOB or age' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed, age, dob, contact });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await redisClient.setEx(user._id.toString(), 86400, token); // 24h = 86400s

        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Signup failed' });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await redisClient.setEx(user._id.toString(), 86400, token);

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
});

module.exports = router;
