import api from './api';

export const invoiceService = {
  getAll: async (params) => {
    return api.get('/invoices', { params });
  },
  getById: async (id) => {
    return api.get(`/invoices/${id}`);
  },
  create: async (data) => {
    return api.post('/invoices', data);
  },
  updateStatus: async (id, status) => {
    return api.put(`/invoices/${id}/status`, { status });
  },
  downloadPdf: (id) => {
    window.open(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/invoices/${id}/pdf`, '_blank');
  },
};
