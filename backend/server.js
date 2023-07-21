const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gamingGroupsRoutes = require('./routes/gamingGroups');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB(); 

// Routes
app.use('/auth', authRoutes); // User authentication routes
app.use('/users', userRoutes); // User profile routes
app.use('/groups', gamingGroupsRoutes); // Gaming groups routes


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
