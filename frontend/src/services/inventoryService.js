import api from './api';

export const inventoryService = {
  stockIn: async (data) => {
    return api.post('/inventory/stock-in', data);
  },
  stockOut: async (data) => {
    return api.post('/inventory/stock-out', data);
  },
  adjustStock: async (data) => {
    return api.post('/inventory/adjust-stock', data);
  },
  transferStock: async (data) => {
    return api.post('/inventory/transfer-stock', data);
  },
  getMovements: async (params) => {
    return api.get('/inventory/movements', { params });
  },
  getLowStockAlerts: async () => {
    return api.get('/inventory/low-stock-alerts');
  },
};
