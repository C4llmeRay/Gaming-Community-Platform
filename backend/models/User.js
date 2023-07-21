const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    gamingPreferences: [String],
    socialLinks: {
      twitter: String,
      facebook: String,
      instagram: String,
    },
    hasCompletedSecondPhase: { type: Boolean, default: false }, // New field to indicate completion of registration second phase
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
