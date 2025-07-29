// controllers/testimonialController.js
const Testimonial = require('../models/Testimonial');

// @desc Get all testimonials
// @route GET /api/testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get testimonial by ID
// @route GET /api/testimonials/:id
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({ _id: req.params.id, isActive: true });
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Create new testimonial (Admin only)
// @route POST /api/testimonials
exports.createTestimonial = async (req, res) => {
  try {
    const { name, quote, imageUrl } = req.body;
    
    if (!name || !quote || !imageUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const testimonial = await Testimonial.create({
      name,
      quote,
      imageUrl
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Update testimonial (Admin only)
// @route PUT /api/testimonials/:id
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Delete testimonial (Admin only)
// @route DELETE /api/testimonials/:id
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 