const socketio = require('socket.io');

const chatSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chatMessage', (message) => {
      console.log('Received chat message:', message);
      console.log('Received groupId:', message.groupId);

      // Broadcast the message to all members of the group
      const groupId = message.groupId;
      io.to(groupId).emit('message', message);
    });

    const groupId = socket.handshake.query.groupId;
    console.log('Joining groupId:', groupId);
    socket.join(groupId);
  });
};

module.exports = chatSocket;