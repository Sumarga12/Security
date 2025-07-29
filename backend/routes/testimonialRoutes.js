// routes/testimonialRoutes.js
const express = require('express');
const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { protect, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);

// Protected routes (Admin only)
router.post('/', protect, requireRole('admin'), createTestimonial);
router.put('/:id', protect, requireRole('admin'), updateTestimonial);
router.delete('/:id', protect, requireRole('admin'), deleteTestimonial);

module.exports = router; 