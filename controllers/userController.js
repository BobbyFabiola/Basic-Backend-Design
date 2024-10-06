const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

exports.register = (req, res) => {                                                      // REGISTER a new user
    const { username, email, password } = req.body;                                     // Removed id, let it be auto-generated
    const existingUser = User.getAllUsers().find(user => user.email === email);         // Check if the user already exists
    
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);                               // Hash the password before saving
    const newUser = new User(null, username, email, hashedPassword);                    // Use null or don't set the id; handle auto-increment logic in User model

    try {
        User.createUser(newUser);                                                       // Only call this once
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error saving user:', error);                                     // Added error logging
        return res.status(500).json({ message: 'Error registering user' });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const users = User.getAllUsers();                                                   // Get all users
    console.log('All Users:', users);                                                   // Log all users for debugging

    const user = users.find(user => user.email === email);                              // Find the user by email
    console.log('Found User:', user);                                                   // Log the found user

    if (!user) {
        return res.status(400).json({ message: 'User not found' });                     // User not found
    }

    console.log('Entered Password:', password);
    console.log('Stored Hashed Password:', user.password);                              // Log the stored hashed password

    // Use bcrypt to compare hashed password
    if (!bcrypt.compareSync(password, user.password)) {                                 // Compare hashed password
        return res.status(400).json({ message: 'Incorrect password' });
    } 

    // Generate a token for authentication
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    console.log('Generated Token:', token);                                             // Log token for debugging

    res.json({ message: 'Login successful', token });                                   // Consider including user info if needed
};


exports.getProfile = (req, res) => {                                                    // Get user PROFILE (protected route)
    const user = User.findUserById(req.user.id);                                        // `req.user` comes from the authentication middleware
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
};