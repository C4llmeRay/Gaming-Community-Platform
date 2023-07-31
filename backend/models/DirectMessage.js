const mongoose = require("mongoose");

const directChatMessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const DirectChatMessage = mongoose.model(
  "DirectChatMessage",
  directChatMessageSchema
);

module.exports = DirectChatMessage;
