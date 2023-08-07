const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

// GET /api/users/profile
router.get('/profile', auth, getUserProfile);

// PUT /api/users/profile
router.put('/profile', auth, updateUserProfile);

module.exports = router;
