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
    hasCompletedSecondPhase: { type: Boolean, default: false },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    friendRequests: [
      {
        requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        sender: {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          username: { type: String },
          friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
