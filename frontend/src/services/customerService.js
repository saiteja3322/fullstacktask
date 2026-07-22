import api from './api';

export const customerService = {
  getAll: async (params) => {
    return api.get('/customers', { params });
  },
  getById: async (id) => {
    return api.get(`/customers/${id}`);
  },
  create: async (data) => {
    return api.post('/customers', data);
  },
  update: async (id, data) => {
    return api.put(`/customers/${id}`, data);
  },
  updateFollowUp: async (id, followUpData) => {
    return api.put(`/customers/${id}/follow-up`, followUpData);
  },
  delete: async (id) => {
    return api.delete(`/customers/${id}`);
  },
};
