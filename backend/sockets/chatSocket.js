const socketio = require("socket.io");
const ChatMessage = require("../models/chatMessage");

let io;

const chatSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    const groupId = socket.handshake.query.groupId;
    socket.join(groupId);
  });
};

const getChatSocket = () => io;

module.exports = { chatSocket, getChatSocket };
