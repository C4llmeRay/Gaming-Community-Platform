const express = require("express");
const router = express.Router();
const { getNotifications } = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all notifications for a user
router.get("/", authMiddleware, getNotifications);

module.exports = router;
