const socketio = require("socket.io");
const DirectMessage = require("../models/DirectMessage");

let io;

const directMessagesSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("direct_chat_connection", (socket) => {
    console.log("A user connected to direct chat:", socket.id);
    const conversationId = socket.handshake.query.conversationId;
    socket.join(conversationId);
  });
};

const getDirectMessagesSocket = () => io;

module.exports = { directMessagesSocket, getDirectMessagesSocket };
