const express = require("express");
const router = express.Router();
const directChatMessagesController = require("../controllers/directMessagesController");
const authMiddleware = require("../middleware/authMiddleware");

// Send a direct chat message
router.post("/:conversationId", authMiddleware, directChatMessagesController.sendDirectMessage);
// Get conversation messages for a specific conversation
router.get("/:conversationId", authMiddleware, directChatMessagesController.getConversationMessages);
// Get all conversations for a user
router.get("/user/:userId", authMiddleware, directChatMessagesController.getAllConversations);
// Get or create a conversation between two users
router.post("/user/:userId", authMiddleware, directChatMessagesController.getOrCreateConversation);

module.exports = router;
