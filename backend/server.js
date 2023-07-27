const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gamingGroupsRoutes = require('./routes/gamingGroups');
const chatMessagesRoutes = require('./routes/chatMessages'); 
const gamingSessionRoutes = require('./routes/gamingSession')
const uploadAvatar = require("./middleware/uploadAvatar");
const dotenv = require('dotenv');
const http = require('http');
const { chatSocket } = require('./sockets/chatSocket'); 

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB connection
connectDB();

// Routes
app.use('/auth', uploadAvatar.single('avatar'), authRoutes);
app.use('/users', userRoutes); 
app.use('/groups', gamingGroupsRoutes); 
app.use('/chatMessages', chatMessagesRoutes); 
app.use('/gamingSessions', gamingSessionRoutes);

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize the chatSocket passing the server instance
chatSocket(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
