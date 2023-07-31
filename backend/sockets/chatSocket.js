const socketio = require("socket.io");

let io;

const chatSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connections", (socket) => {
    console.log("A user connected to chat:", socket.id);
    const groupId = socket.handshake.query.groupId;
    socket.join(groupId);
  });
};

const getChatSocket = () => io;

module.exports = { chatSocket, getChatSocket };
