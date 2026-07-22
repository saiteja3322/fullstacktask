import api from './api';

export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  logout: async () => {
    return api.post('/auth/logout');
  },
  getProfile: async () => {
    return api.get('/auth/profile');
  },
  updateProfile: async (formData) => {
    return api.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  changePassword: async (passwords) => {
    return api.put('/auth/change-password', passwords);
  },
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },
  resetPassword: async (data) => {
    return api.post('/auth/reset-password', data);
  },
};
