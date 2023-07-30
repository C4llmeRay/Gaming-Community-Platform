const socketio = require("socket.io");

let io;

const notificationSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });

    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined the room`);
    });

    socket.on("leaveRoom", (userId) => {
      socket.leave(userId);
      console.log(`User ${userId} left the room`);
    });

    // Handle other notification-related events here
    // For example, receiving and sending notifications

    // Emit a sample notification to the client every 30 seconds (for testing purposes)
    setInterval(() => {
      const notificationData = {
        message: "This is a sample notification",
        timestamp: Date.now(),
      };
      socket.emit("notification", notificationData);
    }, 30000);
  });
};

const getNotificationSocket = () => io;

module.exports = { notificationSocket, getNotificationSocket };
