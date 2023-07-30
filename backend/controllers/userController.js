const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({ message: 'User registered successfully', token });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({ message: 'User logged in successfully', token });
};

const getUserProfile = async (req, res) => {
    res.json(req.user);
};

const updateUserProfile = async (req, res) => {
    const { name, email, password } = req.body;

    const user = req.user;

    user.name = name || user.name;
    user.email = email || user.email;

    if(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({ message: 'User updated', user: updatedUser });
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
