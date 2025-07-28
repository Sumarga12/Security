// src/api/services.ts
import { apiGet } from './index';
import { Service } from '../../types';

// Services API functions
export const servicesAPI = {
  // Get all services
  getAllServices: async (): Promise<Service[]> => {
    return await apiGet('/services');
  },

  // Get service by ID
  getServiceById: async (id: string): Promise<Service> => {
    return await apiGet(`/services/${id}`);
  },

  // Get services by category
  getServicesByCategory: async (category: string): Promise<Service[]> => {
    return await apiGet(`/services/category/${category}`);
  },

  // Get unique categories
  getCategories: async (): Promise<string[]> => {
    const services = await apiGet('/services');
    const categories = [...new Set(services.map((service: Service) => service.category))];
    return categories.sort() as string[];
  },
}; 