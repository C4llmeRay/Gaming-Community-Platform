const jwt = require('jsonwebtoken');
const User = require('../models/User');


const getUserProfile = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token using the JWT secret from the .env file
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded token contains the user ID
    if (!decodedToken.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find the user by their ID
    const user = await User.findById(decodedToken.userId);

    // If the user is found, return their profile information
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const updatedProfile = req.body;

    const user = await User.findByIdAndUpdate(req.params.userId, updatedProfile, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUserProfile, updateUserProfile };
