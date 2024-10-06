const jwt = require('jsonwebtoken');                                    // Retrieve the JWT secret from environment variables or use a fallback for testing
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';          // Securely store this in environment variables

function authenticateToken(req, res, next) {                            // Middleware function to authenticate token
    const authHeader = req.headers['authorization'];                    // Fetch the authorization header
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];                             // Get the token part (after 'Bearer ')
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, jwtSecret, (err, decodedUser) => {                // Verify the token
        if (err) {
            console.error('JWT verification error:', err.message);      // Log the error for debugging
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = decodedUser;                                         // Attach the decoded user data to the request object
        console.log('Authenticated user:', decodedUser);                // Log the authenticated user for debugging
        next();                                                         // Proceed to the next middleware or route handler
    });
}

module.exports = authenticateToken;
