// Middleware to protect routes, ensuring only authenticated users can access them.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (format: "Bearer TOKEN")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to the request object (excluding password)
            req.user = decoded.id; // Store user ID
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check for admin role
const authorizeAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user); // req.user is set by the protect middleware
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Not authorized as an admin' });
        }
    } catch (error) {
        console.error('Admin authorization failed:', error);
        res.status(500).json({ message: 'Server error during authorization' });
    }
};

module.exports = { protect, authorizeAdmin };

// --- File: backend/routes/auth.js ---
// API routes for user authenti