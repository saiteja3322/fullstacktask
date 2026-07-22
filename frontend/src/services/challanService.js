import api from './api';

export const challanService = {
  getAll: async (params) => {
    return api.get('/challans', { params });
  },
  getById: async (id) => {
    return api.get(`/challans/${id}`);
  },
  create: async (data) => {
    return api.post('/challans', data);
  },
  confirm: async (id) => {
    return api.put(`/challans/${id}/confirm`);
  },
  cancel: async (id) => {
    return api.put(`/challans/${id}/cancel`);
  },
  delete: async (id) => {
    return api.delete(`/challans/${id}`);
  },
  downloadPdf: (id) => {
    window.open(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/challans/${id}/pdf`, '_blank');
  },
};
