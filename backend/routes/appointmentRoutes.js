// routes/appointmentRoutes.js
const express = require('express');
const {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', createAppointment);
router.get('/', getUserAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/status', updateAppointmentStatus);
router.delete('/:id', cancelAppointment);

module.exports = router; 