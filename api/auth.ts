// src/api/auth.ts
import { apiPost, apiPut } from './index';
import { User } from '../../types';


export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (data: LoginData): Promise<any> => {
    const response = await apiPost('/auth/login', data);
    return response;
  },

  // Register user
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await apiPost('/auth/signup', data);
    // Don't store token automatically - let user log in separately
    // if (response.token) {
    //   localStorage.setItem('homeglam_token', response.token);
    //   localStorage.setItem('homeglam_user', JSON.stringify(response.user));
    // }
    return response;
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    return await apiPost('/auth/change-password', data, true);
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData): Promise<{ user: User; message: string }> => {
    return await apiPut('/auth/profile', data, true);
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    return await apiPost('/auth/request-password-reset', { email });
  },

  // Reset password with token
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    return await apiPut(`/auth/reset-password/${token}`, { password });
  },

  // Verify MFA code
  verifyMfa: async (email: string, code: string): Promise<AuthResponse> => {
    return await apiPost('/auth/verify-mfa', { email, code });
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('homeglam_token');
    localStorage.removeItem('homeglam_user');
    localStorage.removeItem('homeglam_login_time');
    sessionStorage.removeItem('homeglam_token');
    sessionStorage.removeItem('homeglam_user');
    sessionStorage.removeItem('homeglam_login_time');
  },

  // Get current user from localStorage or sessionStorage
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('homeglam_user') || sessionStorage.getItem('homeglam_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!(localStorage.getItem('homeglam_token') || sessionStorage.getItem('homeglam_token'));
  },
};
