const mongoose = require('mongoose');

const gamingSessionSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  game: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  requiredPlayers: {
    type: Number,
    required: true,
  },
  joinedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  rsvpedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const GamingSession = mongoose.model('GamingSession', gamingSessionSchema);

module.exports = GamingSession;
