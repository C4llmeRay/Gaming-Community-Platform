const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userController = require('../controllers/userController')

const router = express.Router();

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Get user profile
router.get('/:userId', userController.getUserProfile);

// Update user profile
router.patch('/:userId', userController.updateUserProfile);

module.exports = router;
