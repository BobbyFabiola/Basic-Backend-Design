const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

exports.register = (req, res) => {                                                      // REGISTER a new user
    const { id, username, email, password } = req.body;
    const existingUser = User.getAllUsers().find(user => user.email === email);         // Check if the user already exists
    
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);                               // Hash the password before saving
    const newUser = new User(id, username, email, hashedPassword);                      // Create a new user and add to the JSON file
    User.createUser(newUser);

    try {
        User.createUser(newUser);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        return res.status(500).json({ message: 'Error registering user' });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const users = User.getAllUsers();                                                   // Get all users
    const user = users.find(user => user.email === email);                              // Find the user by email

    if (!user) {
        return res.status(400).json({ message: 'User not found' });                     // User not found
    }

    console.log('Entered Password:', password);                                         // Plain-text password check (for testing only, not for production)
    console.log('Stored Plain Password:', user.password);

    if (password !== user.password) {                                                   // Compare plain-text passwords
        return res.status(400).json({ message: 'Incorrect password' });
    }                                                                                   // Generate a token for authentication (this remains the same)
    
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    console.log('Generated Token:', token);                                             // Log token for debugging

    res.json({ message: 'Login successful', token });
};


exports.getProfile = (req, res) => {                                                    // Get user PROFILE (protected route)
    const user = User.findUserById(req.user.id);                                        // `req.user` comes from the authentication middleware
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
};