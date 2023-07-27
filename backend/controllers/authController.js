const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const path = require("path");
const fs = require("fs");




const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      hasCompletedSecondPhase: false, // Initialize the second phase completion status
      following: [], 
    });

    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    // Send the token and userId in the response
    res.status(201).json({ token, userId: newUser._id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const completeSecondPhase = async (req, res) => {
  try {
    const { userId, gamingPreferences, avatar } = req.body;

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user with gamingPreferences and avatar
    user.gamingPreferences = gamingPreferences;
    user.avatar = avatar;
    user.hasCompletedSecondPhase = true;
    await user.save();

    res.json({ message: 'Second phase completed successfully' });
  } catch (error) {
    console.error('Error completing second phase:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
   try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); 

    // Send the token in the response
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const uploadAvatar = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar file received" });
    }

    // Get the uploaded file information
    const { filename, path: filePath } = req.file;
    console.log("Uploaded Avatar:", filename); 

    // Generate a new unique filename for the uploaded avatar
    const uniqueFilename = `avatar-${Date.now()}${path.extname(filename)}`;

    // Define the directory to move the avatar file to
    const targetDirectory = path.join(__dirname, "../uploads/avatars");

    // Move the uploaded file to the target directory with the new unique filename
    fs.renameSync(filePath, path.join(targetDirectory, uniqueFilename));

    // Set the avatar path in the request for further processing
    req.avatarPath = `/uploads/avatars/${uniqueFilename}`;

    // Call the next middleware
    next();
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return res.status(500).json({ message: "this error" });
  }
};


module.exports = { registerUser, loginUser, completeSecondPhase, uploadAvatar };