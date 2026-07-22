import api from './api';

export const productService = {
  getAll: async (params) => {
    return api.get('/products', { params });
  },
  getById: async (id) => {
    return api.get(`/products/${id}`);
  },
  create: async (formData) => {
    return api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: async (id, formData) => {
    return api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: async (id) => {
    return api.delete(`/products/${id}`);
  },
};
