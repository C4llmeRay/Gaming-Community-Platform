const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gamingGroupsRoutes = require('./routes/gamingGroups');
const chatMessagesRoutes = require('./routes/chatMessages'); 
const gamingSessionRoutes = require('./routes/gamingSession')
const avatarRoutes = require("./routes/avatarRoutes");
const searchRoutes = require("./routes/search");
const notification = require("./routes/notification")
const directChatMessagesRoutes = require("./routes/directMessages");
const dotenv = require('dotenv');
const http = require('http');
const { chatSocket } = require('./sockets/chatSocket'); 
const io = require("socket.io")(http);
const { directMessagesSocket } = require("./sockets/directMessagesSocket");



dotenv.config();


const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());


// MongoDB connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes); 
app.use('/groups', gamingGroupsRoutes); 
app.use('/chatMessages', chatMessagesRoutes); 
app.use('/gamingSessions', gamingSessionRoutes);
app.use("/search", searchRoutes);
app.use("/avatars", avatarRoutes);
app.use("/notifications", notification);
app.use("/directChatMessages", directChatMessagesRoutes);


// Create an HTTP server using the Express app
const server = http.createServer(app);


// Initialize the chatSocket passing the server instance
directMessagesSocket(server);
chatSocket(server);




// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
