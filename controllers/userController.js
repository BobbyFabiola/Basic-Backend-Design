const User = require('../models/userModel');
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating authentication tokens

// Mock secret for JWT (in a real app, store this securely)
const jwtSecret = 'your_jwt_secret';

// Register a new user
exports.register = (req, res) => {
    const { id, username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = User.getAllUsers().find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user and add to the JSON file
    const newUser = new User(id, username, email, hashedPassword);
    User.createUser(newUser);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
};

// Login a user
exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = User.getAllUsers().find(user => user.email === email);

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check if the password matches
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    // Generate a token for authentication
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
};

// Get user profile (protected route)
exports.getProfile = (req, res) => {
    const user = User.findUserById(req.user.id); // `req.user` comes from the authentication middleware

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
};

