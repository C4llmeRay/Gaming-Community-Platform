const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB(); // Connect to MongoDB using the configuration in database.js


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
