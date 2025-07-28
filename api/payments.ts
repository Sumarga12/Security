// src/api/payments.ts
import { apiGet, apiPost } from './index';

export interface ProcessPaymentData {
  appointmentId: string;
  paymentMethod: 'Visa / MasterCard' | 'PayPal' | 'eSewa' | 'Khalti';
  paymentDetails?: any;
}

export interface Payment {
  id: string;
  appointmentId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: 'Pending' | 'Completed' | 'Failed';
  transactionId: string;
  paymentDetails?: any;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResponse {
  payment?: Payment;
  appointment?: any;
  message?: string;
  clientSecret?: string;
}

// Payments API functions
export const paymentsAPI = {
  // Process payment
  processPayment: async (data: ProcessPaymentData): Promise<PaymentResponse> => {
    return await apiPost('/payments', data, true);
  },

  // Get user's payments
  getUserPayments: async (): Promise<Payment[]> => {
    return await apiGet('/payments', true);
  },

  // Get payment by ID
  getPaymentById: async (id: string): Promise<Payment> => {
    return await apiGet(`/payments/${id}`, true);
  },

  // Get payment by appointment ID
  getPaymentByAppointment: async (appointmentId: string): Promise<Payment> => {
    return await apiGet(`/payments/appointment/${appointmentId}`, true);
  },
}; 