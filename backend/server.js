const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gamingGroupsRoutes = require('./routes/gamingGroups');
const chatMessagesRoutes = require('./routes/chatMessages'); // Import the new route
const dotenv = require('dotenv');
const http = require('http');
const { chatSocket } = require('./sockets/chatSocket'); // Destructure chatSocket from the module

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB connection
connectDB();

// Routes
app.use('/auth', authRoutes); // User authentication routes
app.use('/users', userRoutes); // User profile routes
app.use('/groups', gamingGroupsRoutes); // Gaming groups routes
app.use('/chatMessages', chatMessagesRoutes); // Use the new route for chat messages

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize the chatSocket passing the server instance
chatSocket(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
