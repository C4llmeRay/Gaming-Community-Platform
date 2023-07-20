const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://chaaliaramy:Gj1tNLyVXKmTgvTI@cluster0.us60xnp.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with a failure status
  }
};

module.exports = connectDB;
