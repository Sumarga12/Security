// src/api/index.ts
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// API configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('homeglam_token') || sessionStorage.getItem('homeglam_token');
  console.log('Token from localStorage:', localStorage.getItem('homeglam_token'));
  console.log('Token from sessionStorage:', sessionStorage.getItem('homeglam_token'));
  console.log('Using token:', token);
  return {
    ...apiConfig.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };
};

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  };

  console.log('Making API request to:', url);
  console.log('Request config:', config);

  try {
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Error response data:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// GET request
export const apiGet = (endpoint: string, useAuth = false) => {
  return apiRequest(endpoint, {
    method: 'GET',
    headers: useAuth ? getAuthHeaders() : apiConfig.headers,
  });
};

// POST request
export const apiPost = (endpoint: string, data: any, useAuth = false) => {
  return apiRequest(endpoint, {
    method: 'POST',
    headers: useAuth ? getAuthHeaders() : apiConfig.headers,
    body: JSON.stringify(data),
  });
};

// PUT request
export const apiPut = (endpoint: string, data: any, useAuth = false) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    headers: useAuth ? getAuthHeaders() : apiConfig.headers,
    body: JSON.stringify(data),
  });
};

// DELETE request
export const apiDelete = (endpoint: string, useAuth = false) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
    headers: useAuth ? getAuthHeaders() : apiConfig.headers,
  });
};

// Health check
export const checkApiHealth = () => {
  return apiGet('/health');
};
