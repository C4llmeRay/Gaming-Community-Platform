const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if the Authorization header is present
    let token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not provided' });
    }
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);


    // Find the user by their ID
    const user = await User.findById(decodedToken.userId);
    

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user object to the request so it can be accessed in subsequent middleware or routes
    req.user = user;
    

    // Continue to the next middleware or route
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
