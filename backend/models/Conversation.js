const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  directChatMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DirectChatMessage',
  }],
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
