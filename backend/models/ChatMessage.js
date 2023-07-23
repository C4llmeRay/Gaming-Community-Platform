const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GamingGroup',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to update the corresponding GamingGroup with the new chat message
chatMessageSchema.post('save', async function (doc) {
  try {
    const GamingGroup = require('./GamingGroup'); // Require the GamingGroup model here to avoid circular dependencies
    const groupId = doc.groupId;

    // Push the new chat message ID to the chatMessages array in the corresponding GamingGroup
    await GamingGroup.findByIdAndUpdate(groupId, { $push: { chatMessages: doc._id } });
  } catch (error) {
    console.error('Error updating GamingGroup with new chat message:', error);
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
