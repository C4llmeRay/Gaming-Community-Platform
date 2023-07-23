const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/chatMessage');
const { getChatSocket } = require('../sockets/chatSocket');

router.post('/', async (req, res) => {
  try {
    const { text, groupId, sender } = req.body;

    // Save the chat message to the database
    const message = await ChatMessage.create({
      text,
      groupId,
      sender,
    });

    // Get the chatSocket instance
    const chatSocket = getChatSocket();
    console.log(message.sender)
    // Send the chat message to connected clients
    chatSocket.to(groupId).emit('message', message);

    res.status(200).json({ message: 'Chat message sent successfully' });
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ error: 'Failed to send chat message' });
  }
});

router.get('/:groupId', async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Retrieve all chat messages for the given groupId
    const chatMessages = await ChatMessage.find({ groupId }).populate('sender', 'username');

    res.status(200).json(chatMessages);
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    res.status(500).json({ error: 'Failed to retrieve chat messages' });
  }
});

module.exports = router;
