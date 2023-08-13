const socketio = require("socket.io");

let io;

const directMessagesSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: "*",
    },
  });
  io.of("/chat").on("connection", (socket) => {
    console.log("A user connected to chat:", socket.id);
    const groupId = socket.handshake.query.groupId;
    socket.join(groupId);
  });
  io.of("/direct-messages").on("connection", (socket) => {
    console.log("A user connected to direct chat:", socket.id);
    const conversationId = socket.handshake.query.conversationId;
    socket.join(conversationId);
  });
};

const getDirectMessagesSocket = () => io;

module.exports = { directMessagesSocket, getDirectMessagesSocket };
