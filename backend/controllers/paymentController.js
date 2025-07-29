// controllers/paymentController.js
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/sendEmail');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc Process payment
// @route POST /api/payments
exports.processPayment = async (req, res) => {
  try {
    const { 
      appointmentId, 
      paymentMethod, 
      paymentDetails 
    } = req.body;

    if (!appointmentId || !paymentMethod) {
      return res.status(400).json({ error: 'Appointment ID and payment method are required' });
    }

    // Get appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if user owns this appointment
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ appointmentId });
    if (existingPayment) {
      return res.status(400).json({ error: 'Payment already processed for this appointment' });
    }

    // Stripe integration for Visa/MasterCard
    if (paymentMethod === 'Visa / MasterCard') {
      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(appointment.totalPrice * 100), // Stripe expects amount in cents
        currency: 'npr', // Change to your currency
        metadata: {
          appointmentId: appointmentId,
          userId: req.user.id,
        },
        receipt_email: appointment.customerEmail,
      });
      // Do not mark as completed yet; wait for Stripe confirmation (webhook or client confirmation)
      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: 'Stripe PaymentIntent created',
      });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment record
    const payment = await Payment.create({
      appointmentId,
      userId: req.user.id,
      amount: appointment.totalPrice,
      paymentMethod,
      transactionId,
      paymentDetails,
      status: 'Completed' // For demo purposes, assume payment is successful
    });

    // Update appointment payment status
    appointment.paymentStatus = 'Paid';
    appointment.status = 'Confirmed';
    await appointment.save();

    // Send payment confirmation email
    try {
      const html = `
        <h2>Payment Confirmation</h2>
        <p>Dear ${appointment.customerName},</p>
        <p>Your payment has been processed successfully!</p>
        <h3>Payment Details:</h3>
        <ul>
          <li><strong>Transaction ID:</strong> ${transactionId}</li>
          <li><strong>Amount:</strong> Rs${appointment.totalPrice}</li>
          <li><strong>Payment Method:</strong> ${paymentMethod}</li>
          <li><strong>Service:</strong> ${appointment.serviceName}</li>
          <li><strong>Date:</strong> ${appointment.date}</li>
          <li><strong>Time:</strong> ${appointment.time}</li>
        </ul>
        <p>Your appointment is now confirmed. We look forward to serving you!</p>
        <p>Thank you for choosing HomeCleaning!</p>
      `;
      
      await sendEmail({
        to: appointment.customerEmail,
        subject: 'Payment Confirmation - HomeCleaning',
        html
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      payment,
      appointment,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get payment by ID
// @route GET /api/payments/:id
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('appointmentId');
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if user owns this payment
    if (payment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get user's payments
// @route GET /api/payments
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate('appointmentId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get payment by appointment ID
// @route GET /api/payments/appointment/:appointmentId
exports.getPaymentByAppointment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      appointmentId: req.params.appointmentId,
      userId: req.user.id 
    }).populate('appointmentId');
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 

exports.createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId, paymentMethod } = req.body;
    // Validate appointmentId and fetch appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    const amount = Math.round(appointment.totalPrice * 100); // Use actual price
    const receiptEmail = appointment.getDecryptedCustomerEmail ? appointment.getDecryptedCustomerEmail() : appointment.customerEmail;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'npr', // or 'usd' if using USD
      payment_method_types: ['card'],
      metadata: { appointmentId: appointment._id.toString(), paymentMethod },
      receipt_email: receiptEmail,
    });
    console.log('Created PaymentIntent with metadata:', paymentIntent.metadata);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Failed to create payment intent:', err); // <-- Add this line
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
}; 

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  console.log('Stripe signature:', sig);
  console.log('Loaded STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const appointmentId = paymentIntent.metadata.appointmentId;
    console.log('Webhook received for appointmentId:', appointmentId);
    if (appointmentId) {
      try {
        const result = await Appointment.findByIdAndUpdate(appointmentId.toString(), { paymentStatus: 'Paid' });
        console.log('MongoDB update result:', result);
      } catch (err) {
        console.error('Failed to update appointment paymentStatus:', err);
      }
    } else {
      console.warn('No appointmentId found in paymentIntent metadata.');
    }
  }

  // Respond to Stripe
  res.json({ received: true });
}; 