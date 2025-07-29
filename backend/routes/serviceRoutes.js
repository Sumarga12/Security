// routes/serviceRoutes.js
const express = require('express');
const {
  getServices,
  getServiceById,
  getServicesByCategory,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);
router.get('/category/:category', getServicesByCategory);

// Protected routes (Admin only)
router.post('/', protect, requireRole('admin'), createService);
router.put('/:id', protect, requireRole('admin'), updateService);
router.delete('/:id', protect, requireRole('admin'), deleteService);

module.exports = router; 