const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
                                                                                                        // Mock secret for JWT (in a real app, store this securely)
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';                                          // Use environment variable

exports.register = (req, res) => {                                                                      // Register a new user
    const { id, username, email, password } = req.body;
    const existingUser = User.getAllUsers().find(user => user.email === email);                          // Check if the user already exists
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);                                               // Hash the password before saving
    const newUser = new User(id, username, email, hashedPassword);                                      // Create a new user and add to the JSON file
    User.createUser(newUser);

    try {
        User.createUser(newUser);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        return res.status(500).json({ message: 'Error registering user' });
    }
};

exports.login = (req, res) => {                                                                         // Login a user
    const { email, password } = req.body;
    const users = User.getAllUsers();                                                                   // Get all users first for logging
    const user = users.find(user => user.email === email);

    console.log('All Users:', users);                                                                   // Log all users for debugging
    console.log('User Found:', user);
    
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);                                        // Check if the password matches
    console.log('Entered Password:', password);
    console.log('Stored Hashed Password:', user.password);
    
    if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });         // Generate a token for authentication

    res.json({ message: 'Login successful', token });
};


exports.getProfile = (req, res) => {                                                                    // Get user profile (protected route)
    const user = User.findUserById(req.user.id);                                                        // `req.user` comes from the authentication middleware

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
};
