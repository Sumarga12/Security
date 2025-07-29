// controllers/serviceController.js
const Service = require('../models/Service');

// @desc Get all services
// @route GET /api/services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get service by ID
// @route GET /api/services/:id
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id, isActive: true });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get services by category
// @route GET /api/services/category/:category
exports.getServicesByCategory = async (req, res) => {
  try {
    const services = await Service.find({ 
      category: req.params.category, 
      isActive: true 
    }).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Create new service (Admin only)
// @route POST /api/services
exports.createService = async (req, res) => {
  try {
    const { id, category, name, price, description, imageUrl } = req.body;
    
    if (!id || !category || !name || !price || !description || !imageUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingService = await Service.findOne({ id });
    if (existingService) {
      return res.status(400).json({ error: 'Service ID already exists' });
    }

    const service = await Service.create({
      id,
      category,
      name,
      price,
      description,
      imageUrl
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Update service (Admin only)
// @route PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Delete service (Admin only)
// @route DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 