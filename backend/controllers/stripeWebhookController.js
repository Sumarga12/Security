const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe webhook handler
module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const appointmentId = paymentIntent.metadata.appointmentId;
    const userId = paymentIntent.metadata.userId;
    try {
      // Mark payment as completed in DB
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) return res.status(404).send('Appointment not found');
      // Create payment record if not exists
      let payment = await Payment.findOne({ appointmentId });
      if (!payment) {
        payment = await Payment.create({
          appointmentId,
          userId,
          amount: appointment.totalPrice,
          paymentMethod: 'Visa / MasterCard',
          transactionId: paymentIntent.id,
          paymentDetails: paymentIntent,
          status: 'Completed',
        });
      } else {
        payment.status = 'Completed';
        payment.transactionId = paymentIntent.id;
        payment.paymentDetails = paymentIntent;
        await payment.save();
      }
      appointment.paymentStatus = 'Paid';
      appointment.status = 'Confirmed';
      await appointment.save();
    } catch (err) {
      return res.status(500).send('Failed to update payment status');
    }
  }
  res.json({ received: true });
}; 