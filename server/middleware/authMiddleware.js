const jwt = require('jsonwebtoken');

/**
 * AUTHENTICATE TOKEN
 * Function: Intercepts protected routes to verify the JWT signature.
 * PRD Reference: 4.0 User Authentication / 6. Data Flow
 */
const authenticateToken = (req, res, next) => {
    // 1. Retrieve the Auth Header
    const authHeader = req.headers['authorization'];
    
    // Format is usually "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // 2. Verify Token
    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }

        // 3. Attach User to Request
        // This allows controllers to access req.user.userId
        req.user = user;
        
        next();
    });
};

module.exports = { authenticateToken };