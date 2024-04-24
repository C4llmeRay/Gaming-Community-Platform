const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Mail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already in use" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      hasCompletedSecondPhase: false,
      following: [],
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Verify your email address",
      html: `Click <a href="${verificationLink}">here</a> to verify your email address.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
        return res
          .status(500)
          .json({ message: "Failed to send verification email" });
      }
      console.log("Verification email sent:", info.response);
      res.status(201).json({
        message: "User registered successfully. Verification email sent.",
      });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const completeSecondPhase = async (req, res) => {
  try {
    const { userId, gamingPreferences, avatar } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the user with gamingPreferences and avatar
    user.gamingPreferences = gamingPreferences;
    user.avatar = avatar;
    user.hasCompletedSecondPhase = true;
    await user.save();
    res.json({ message: "Second phase completed successfully" });
  } catch (error) {
    console.error("Error completing second phase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    // Send the token in the response
    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, completeSecondPhase };
