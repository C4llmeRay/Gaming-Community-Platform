const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

// Search for gaming groups
router.get("/groups", searchController.searchGroups);

// Search for friends
router.get("/friends", searchController.searchFriends);

// Search for gaming sessions
router.get("/sessions", searchController.searchSessions);

module.exports = router;
