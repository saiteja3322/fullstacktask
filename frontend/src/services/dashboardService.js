import api from './api';

export const dashboardService = {
  getSummary: async () => {
    return api.get('/dashboard/summary');
  },
  getActivityLogs: async (params) => {
    return api.get('/activity-logs', { params });
  },
};
