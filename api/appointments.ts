// src/api/appointments.ts
import { apiGet, apiPost, apiPut, apiDelete } from './index';
import { Appointment } from '../../types';

export interface CreateAppointmentData {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message?: string;
  totalPrice: number;
}

export interface UpdateAppointmentStatusData {
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
}

// Appointments API functions
export const appointmentsAPI = {
  // Create new appointment
  createAppointment: async (data: CreateAppointmentData): Promise<Appointment> => {
    return await apiPost('/appointments', data, true);
  },

  // Get user's appointments
  getUserAppointments: async (): Promise<Appointment[]> => {
    return await apiGet('/appointments', true);
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<Appointment> => {
    return await apiGet(`/appointments/${id}`, true);
  },

  // Update appointment status
  updateAppointmentStatus: async (id: string, data: UpdateAppointmentStatusData): Promise<Appointment> => {
    return await apiPut(`/appointments/${id}/status`, data, true);
  },

  // Cancel appointment
  cancelAppointment: async (id: string): Promise<{ message: string }> => {
    return await apiDelete(`/appointments/${id}`, true);
  },
}; 