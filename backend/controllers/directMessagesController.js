const Conversation = require("../models/Conversation");
const DirectChatMessage = require("../models/DirectMessage");
const User = require("../models/User");
const { getDirectMessagesSocket } = require("../sockets/directMessagesSocket");

const getConversationMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findById(conversationId).populate({
      path: "directChatMessages",
      populate: {
        path: "sender",
        select: "username", 
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json({ messages: conversation.directChatMessages });
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    res.status(500).json({ error: "Failed to fetch conversation messages" });
  }
};

const getAllConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId });
    console.log("User id:", userId);
    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

const getOrCreateConversation = async (req, res) => {
  try {
    const user1 = req.user._id;
    const user2 = req.params.userId;

    const existingConversation = await Conversation.findOne({
      participants: { $all: [user1, user2] },
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    const newConversation = await Conversation.create({
      participants: [user1, user2],
    });

    console.log("New conversation created");
    return res.json(newConversation);
  } catch (error) {
    console.error("Error getting or creating conversation:", error);
    return res
      .status(500)
      .json({ error: "Failed to get or create conversation" });
  }
};

const sendDirectMessage = async (req, res) => {
  try {
    const { text, receiver } = req.body;
    const sender = req.user._id;
    const conversationId = req.params.conversationId;

    // Save the direct chat message to the database
    const message = await DirectChatMessage.create({
      text,
      sender,
      receiver,
    });

    // Add the message to the conversation's directChatMessages array
    const conversation = await Conversation.findById(conversationId);
    conversation.directChatMessages.push(message);
    await conversation.save();

    // Get the chatSocket instance
    const directMessagesSocket = getDirectMessagesSocket();
    // Send the direct chat message to connected clients
    directMessagesSocket
      .of("/direct-messages")
      .to(conversationId)
      .emit("direct_message", message);

    res.status(200).json({ message: "Direct chat message sent successfully" });
  } catch (error) {
    console.error("Error sending direct chat message:", error);
    res.status(500).json({ error: "Failed to send direct chat message" });
  }
};

const deleteDirectMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user._id;
    // Find the direct message from the database using the Mongoose model
    const message = await DirectChatMessage.findById(messageId);
    // Check if the message exists
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    // Check if the user making the request is the sender or receiver of the message
    if (
      message.sender.toString() !== userId.toString() &&
      message.receiver.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this message" });
    }
    // Delete the message using the Mongoose model's remove method
await DirectChatMessage.deleteOne({ _id: messageId });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting direct message:", error);
    res.status(500).json({ error: "Failed to delete direct message" });
  }
};


module.exports = {
  sendDirectMessage,
  getConversationMessages,
  getAllConversations,
  getOrCreateConversation,
  deleteDirectMessage,
};
