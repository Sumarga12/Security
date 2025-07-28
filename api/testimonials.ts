// src/api/testimonials.ts
import { apiGet } from './index';
import { Testimonial } from '../../types';

// Testimonials API functions
export const testimonialsAPI = {
  // Get all testimonials
  getAllTestimonials: async (): Promise<Testimonial[]> => {
    return await apiGet('/testimonials');
  },

  // Get testimonial by ID
  getTestimonialById: async (id: string): Promise<Testimonial> => {
    return await apiGet(`/testimonials/${id}`);
  },
}; 