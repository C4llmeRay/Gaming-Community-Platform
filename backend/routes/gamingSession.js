const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const gamingSessionController = require("../controllers/gamingSessionController");

const router = express.Router();
// Create a new gaming session
router.post(
  "/sessions",
  authMiddleware,
  gamingSessionController.createGamingSession
);
// Get all gaming sessions
router.get("/sessions", gamingSessionController.getAllGamingSessions);
// Join a gaming session
router.post(
  "/sessions/:sessionId/join",
  authMiddleware,
  gamingSessionController.joinGamingSession
);
// Accept RSVP to a gaming session
router.post(
  "/sessions/:sessionId/accept",
  authMiddleware,
  gamingSessionController.acceptRSVP
);
// Decline RSVP to a gaming session
router.post(
  "/sessions/:sessionId/decline",
  authMiddleware,
  gamingSessionController.declineRSVP
);
// Edit gaming session details
router.patch(
  "/sessions/:sessionId",
  authMiddleware,
  gamingSessionController.editGamingSession
);
// get current user hosted sessions
router.get(
  "/hosted-sessions",
  authMiddleware,
  gamingSessionController.getHostedGamingSessions
);
// Delete a gaming session
router.delete(
  "/sessions/:sessionId",
  authMiddleware,
  gamingSessionController.deleteGamingSession
);
// Send an invitation to a user for a gaming session
router.post(
  "/sessions/:sessionId/invite",
  authMiddleware,
  gamingSessionController.sendInvitation
);
// Get gaming sessions where the current user has RSVPed
router.get(
  "/invitations",
  authMiddleware,
  gamingSessionController.getUserInvitations
);
// Get gaming sessions where the current user has joined as a participant
router.get(
  "/joined-sessions",
  authMiddleware,
  gamingSessionController.getJoinedGamingSessions
);
// Leave a gaming session
router.post(
  "/sessions/:sessionId/leave",
  authMiddleware,
  gamingSessionController.leaveGamingSession
);

module.exports = router;
