const GamingSession = require('../models/GamingSession');

// Create a new gaming session
const createGamingSession = async (req, res) => {
  try {
    const { game, date, time, requiredPlayers } = req.body;
    const host = req.user._id;

    const newSession = new GamingSession({
      host,
      game,
      date,
      time,
      requiredPlayers,
    });

    await newSession.save();

    res.json({ message: 'Gaming session created successfully', session: newSession });
  } catch (error) {
    console.error('Error creating gaming session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all gaming sessions
const getAllGamingSessions = async (req, res) => {
  try {
    const sessions = await GamingSession.find().populate('host', 'username');
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching gaming sessions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Join a gaming session
const joinGamingSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user._id;

    const session = await GamingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Gaming session not found' });
    }

    if (session.joinedPlayers.includes(userId)) {
      return res.status(400).json({ message: 'You have already joined this session' });
    }

    if (session.joinedPlayers.length >= session.requiredPlayers) {
      return res.status(400).json({ message: 'This session is already full' });
    }

    session.joinedPlayers.push(userId);
    await session.save();

    res.json({ message: 'You have successfully joined the gaming session', session });
  } catch (error) {
    console.error('Error joining gaming session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// RSVP to a gaming session
const rsvpToGamingSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user._id;

    const session = await GamingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Gaming session not found' });
    }

    if (session.rsvpedPlayers.includes(userId)) {
      return res.status(400).json({ message: 'You have already RSVPed to this session' });
    }

    session.rsvpedPlayers.push(userId);
    await session.save();

    res.json({ message: 'You have successfully RSVPed to the gaming session', session });
  } catch (error) {
    console.error('Error RSVPing to gaming session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createGamingSession,
  getAllGamingSessions,
  joinGamingSession,
  rsvpToGamingSession,
};
