// seed.js
require('dotenv').config();
const connectDB = require('./config/db');
const seedData = require('./utils/seedData');

// Connect to database
connectDB();

// Run seeding
seedData(); 