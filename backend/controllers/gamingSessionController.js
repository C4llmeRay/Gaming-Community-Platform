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
// Send an invitation to a user for a gaming session
const sendInvitation = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { userId } = req.body;

    const session = await GamingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Gaming session not found' });
    }

    // Check if the user is the host of the session
    if (session.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to send invitations for this session' });
    }

    // Check if the user to invite is already part of the joinedPlayers or rsvpedPlayers
    if (session.joinedPlayers.includes(userId) || session.rsvpedPlayers.includes(userId)) {
      return res.status(400).json({ message: 'This user has already joined or RSVPed to this session' });
    }

    // Add the user to the rsvpedPlayers array
    session.rsvpedPlayers.push(userId);
    await session.save();

    res.json({ message: 'Invitation sent successfully', session });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Accept RSVP to a gaming session
const acceptRSVP = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user._id; // Use the authenticated user's ID instead of getting it from the request body

    const session = await GamingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Gaming session not found' });
    }

    if (!session.rsvpedPlayers.includes(userId)) { // Check if the user's ID is in rsvpedPlayers array
      return res.status(400).json({ message: 'User has not RSVPed to this session' });
    }

    // Move the user from rsvpedPlayers to joinedPlayers array
    session.rsvpedPlayers.pull(userId);
    session.joinedPlayers.push(userId);
    await session.save();

    return res.json({ message: 'RSVP accepted successfully', session });
  } catch (error) {
    console.error('Error accepting RSVP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Decline RSVP to a gaming session
const declineRSVP = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user._id; 

    const session = await GamingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Gaming session not found' });
    }

    if (!session.rsvpedPlayers.includes(userId)) { // Check if the user's ID is in rsvpedPlayers array
      return res.status(400).json({ message: 'User has not RSVPed to this session' });
    }

    // Remove the user from rsvpedPlayers array (no need to touch joinedPlayers in this case)
    session.rsvpedPlayers.pull(userId);
    await session.save();

    return res.json({ message: 'RSVP declined successfully', session });
  } catch (error) {
    console.error('Error declining RSVP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Edit gaming session details
const editGamingSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { game, date, time, requiredPlayers } = req.body;

    const session = await GamingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Gaming session not found' });
    }

    // Update session details
    session.game = game;
    session.date = date;
    session.time = time;
    session.requiredPlayers = requiredPlayers;
    await session.save();

    return res.json({ message: 'Gaming session updated successfully', session });
  } catch (error) {
    console.error('Error updating gaming session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get gaming sessions hosted by the current user
const getHostedGamingSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const hostedSessions = await GamingSession.find({ host: userId });
    res.json(hostedSessions);
  } catch (error) {
    console.error('Error fetching hosted gaming sessions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a gaming session
const deleteGamingSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user._id;

    const session = await GamingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Gaming session not found" });
    }
    // Check if the current user is the host of the session
    if (session.host.toString() !== userId.toString()) {
      console.log("Unauthorized deletion attempt.");
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this session" });
    }

    const deletedSession = await GamingSession.deleteOne({ _id: sessionId });

    if (deletedSession.deletedCount === 1) {
      return res.json({ message: "Gaming session deleted successfully" });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to delete the gaming session" });
    }
  } catch (error) {
    console.error("Error deleting gaming session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get gaming sessions where the current user has RSVPed
const getUserInvitations = async (req, res) => {
  try {
    const userId = req.user._id;
    const invitations = await GamingSession.find({
      rsvpedPlayers: userId,
    }).populate("host", "username");
    res.json(invitations);
  } catch (error) {
    console.error("Error fetching user invitations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get gaming sessions where the current user has joined as a participant
const getJoinedGamingSessions = async (req, res) => {
  try {
    // Assuming the user's ID is stored in req.user.id after authentication
    const userId = req.user.id;

    // Perform the query to fetch the gaming sessions where the user has joined
    const gamingSessions = await GamingSession.find({ joinedPlayers: userId })
      .populate("joinedPlayers", "username") // Populate joinedPlayers with username field
      .populate("host", "username"); 

    res.json(gamingSessions);
  } catch (error) {
    console.error("Error fetching user's joined gaming sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Leave a gaming session
const leaveGamingSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user._id;

    const session = await GamingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Gaming session not found" });
    }

    // Check if the user has already joined the session
    if (!session.joinedPlayers.includes(userId)) {
      return res.status(400).json({ message: "You have not joined this session" });
    }

    // Remove the user from joinedPlayers array
    session.joinedPlayers.pull(userId);
    await session.save();

    return res.json({ message: "You have successfully left the gaming session" });
  } catch (error) {
    console.error("Error leaving gaming session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createGamingSession,
  getAllGamingSessions,
  joinGamingSession,
  acceptRSVP,
  declineRSVP,
  editGamingSession,
  getHostedGamingSessions,
  deleteGamingSession,
  sendInvitation,
  getUserInvitations,
  getJoinedGamingSessions,
  leaveGamingSession,
};
