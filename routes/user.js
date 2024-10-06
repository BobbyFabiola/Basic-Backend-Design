const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// Route for registering a new user
router.post('/register', userController.register);

// Route for logging in a user
router.post('/login', userController.login);

// Route to get the profile of a logged-in user (requires authentication)
router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router;
