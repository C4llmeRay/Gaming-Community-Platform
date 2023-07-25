const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const gamingSessionController = require('../controllers/gamingSessionController');

const router = express.Router();

// Create a new gaming session
router.post('/sessions', authMiddleware, gamingSessionController.createGamingSession);

// Get all gaming sessions
router.get('/sessions', gamingSessionController.getAllGamingSessions);

// Join a gaming session
router.post('/sessions/:sessionId/join', authMiddleware, gamingSessionController.joinGamingSession);

// RSVP to a gaming session
router.post('/sessions/:sessionId/rsvp', authMiddleware, gamingSessionController.rsvpToGamingSession);

module.exports = router;
