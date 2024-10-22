const jwt = require('jsonwebtoken');
const config = require('config'); // Ensure 'config' is installed and configured

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); // Use your JWT secret here
        req.user = decoded; // Set user ID in request
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;
