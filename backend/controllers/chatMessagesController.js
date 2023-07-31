const ChatMessage = require('../models/chatMessage');
const { getChatSocket } = require('../sockets/chatSocket');

const sendMessage = async (req, res) => {
  try {
    const { text, groupId, sender } = req.body;

    // Save the chat message to the database
    const message = await ChatMessage.create({
      text,
      groupId,
      sender,
    });

    const chatSocket = getChatSocket();

    // Send the chat message to connected clients
    chatSocket.to(groupId).emit("message", message);

    res.status(200).json({ message: "Chat message sent successfully" });
  } catch (error) {
    console.error("Error sending chat message:", error);
    res.status(500).json({ error: "Failed to send chat message" });
  }
};

const getMessagesByGroupId = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Retrieve all chat messages for the given groupId
    const chatMessages = await ChatMessage.find({ groupId }).populate('sender', 'username');

    res.status(200).json(chatMessages);
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    res.status(500).json({ error: 'Failed to retrieve chat messages' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Retrieve the message from the database
    const message = await ChatMessage.findById(messageId);

    // Check if the message exists
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

  

    // Check if the user making the request is the owner of the message or has necessary privileges
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not allowed to delete this message' });
    }

    // Delete the message
    const result = await ChatMessage.deleteOne({ _id: messageId });

    if (result.deletedCount === 1) {
      return res.status(200).json({ message: 'Message deleted successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to delete chat message' });
    }
  } catch (error) {
    console.error('Error deleting chat message:', error);
    res.status(500).json({ error: 'Failed to delete chat message' });
  }
};

module.exports = {
  sendMessage,
  getMessagesByGroupId,
  deleteMessage,
};
