// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/homeglam';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri, {
      useNewUrlParser:   true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Don't exit, just log the error
    console.log('Continuing without database connection...');
  }
};

module.exports = connectDB;
