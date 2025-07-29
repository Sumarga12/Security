// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const csurf = require('csurf');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const paymentController = require('./controllers/paymentController');
// const testimonialRoutes = require('./routes/testimonialRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://apis.google.com'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(mongoSanitize());
app.use(xss());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true 
}));

// Only apply CSRF to state-changing routes
// app.use(['/api/auth', '/api/appointments', '/api/payments', '/api/services', '/api/testimonials'], csurf({ cookie: false }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HomeGlam API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register the Stripe webhook route directly before body parsers
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

// NOW register body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes (all after body parsers)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes); // for non-webhook payment routes
// app.use('/api/testimonials', testimonialRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HomeGlam API server running on port ${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
  console.log(`🗄️  Database: ${process.env.MONGO_URI ? 'Connected' : 'Not connected'}`);
});
