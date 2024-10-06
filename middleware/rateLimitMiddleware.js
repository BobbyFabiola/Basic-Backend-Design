const rateLimit = {};  // Move this to the top

const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip; 
    const currentTime = Date.now();
    const windowTime = 30 * 1000; // 30 seconds in milliseconds
    const limit = 5; // Max requests allowed

    if (!rateLimit[ip]) { 
        rateLimit[ip] = {
            count: 1,
            startTime: currentTime
        };
    } else {
        if (currentTime - rateLimit[ip].startTime > windowTime) { 
            rateLimit[ip].count = 1; 
            rateLimit[ip].startTime = currentTime; 
        } else {
            rateLimit[ip].count += 1; 
            if (rateLimit[ip].count > limit) {
                return res.status(429).json({ message: 'Too many requests, please try again later.' });
            }
        }
    }
    next(); 
};

module.exports = rateLimitMiddleware;
