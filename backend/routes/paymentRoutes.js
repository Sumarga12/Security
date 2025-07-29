// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create Stripe PaymentIntent
router.post('/', paymentController.createPaymentIntent);

module.exports = router; 