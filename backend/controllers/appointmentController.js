const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { sendEmail } = require('../utils/sendEmail');

// @desc Create new appointment
// @route POST /api/appointments
exports.createAppointment = async (req, res) => {
  console.log (req.body);
  try {
    const { 
      serviceId, 
      serviceName, 
      date, 
      time, 
      customerName, 
      customerEmail, 
      customerPhone, 
      message, 
      totalPrice 
    } = req.body;

    if (!serviceId || !serviceName || !date || !time || !customerName || !customerEmail || !customerPhone || !totalPrice) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
      serviceId,
      serviceName,
      date,
      time,
      customerName,
      customerEmail,
      customerPhone,
      message,
      totalPrice
    });

    // Send confirmation email
    try {
      const html = `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${customerName},</p>
        <p>Your appointment has been successfully booked!</p>
        <h3>Appointment Details:</h3>
        <ul>
          <li><strong>Service:</strong> ${serviceName}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Total Amount:</strong> Rs${totalPrice}</li>
        </ul>
        <p>We will contact you shortly to confirm your appointment.</p>
        <p>Thank you for choosing HomeCleaning!</p>
      `;
      await sendEmail({
        to: customerEmail,
        subject: 'Appointment Confirmation - HomeCleaning',
        html
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get user's appointments
// @route GET /api/appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get appointment by ID
// @route GET /api/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Update appointment status
// @route PUT /api/appointments/:id/status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Confirmed', 'Completed', 'Cancelled', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    appointment.status = status;
    await appointment.save();

    // Send status update email
    try {
      const html = `
        <h2>Appointment Status Update</h2>
        <p>Dear ${appointment.customerName},</p>
        <p>Your appointment status has been updated to: <strong>${status}</strong></p>
        <h3>Appointment Details:</h3>
        <ul>
          <li><strong>Service:</strong> ${appointment.serviceName}</li>
          <li><strong>Date:</strong> ${appointment.date}</li>
          <li><strong>Time:</strong> ${appointment.time}</li>
        </ul>
        <p>Thank you for choosing HomeCleaning!</p>
      `;
      await sendEmail({
        to: appointment.customerEmail,
        subject: `Appointment ${status} - HomeCleaning`,
        html
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Cancel appointment
// @route DELETE /api/appointments/:id
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    appointment.status = 'Cancelled';
    await appointment.save();

    // Send cancellation email
    try {
      const html = `
        <h2>Appointment Cancellation</h2>
        <p>Dear ${appointment.customerName},</p>
        <p>Your appointment with HomeCleaning has been cancelled.</p>
        <h3>Appointment Details:</h3>
        <ul>
          <li><strong>Service:</strong> ${appointment.serviceName}</li>
          <li><strong>Date:</strong> ${appointment.date}</li>
          <li><strong>Time:</strong> ${appointment.time}</li>
        </ul>
        <p>We apologize for any inconvenience this may have caused.</p>
        <p>Thank you for choosing HomeCleaning!</p>
      `;
      await sendEmail({
        to: appointment.customerEmail,
        subject: 'Appointment Cancelled - HomeCleaning',
        html
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};