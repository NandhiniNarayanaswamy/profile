const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, age, dob, contact } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, age, dob, contact },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
