const jwt = require('jsonwebtoken');
const jwtSecret = 'your_jwt_secret';                                    // Make sure this matches your controller
const authenticateToken = require('../middleware/authMiddleware');      // Assuming you have an auth middleware

// Middleware for protecting routes
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];          // Get the token after 'Bearer '
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {                       // Verify the token
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;                                                // Attach the user data to the request
        next();                                                         // Move to the next middleware or route handler
    });
}

module.exports = authenticateToken;

