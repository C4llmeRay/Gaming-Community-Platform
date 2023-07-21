const mongoose = require('mongoose');

const gamingGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rules: {
    type: String,
  },
  privacy: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  game: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const GamingGroup = mongoose.model('GamingGroup', gamingGroupSchema);

module.exports = GamingGroup;
