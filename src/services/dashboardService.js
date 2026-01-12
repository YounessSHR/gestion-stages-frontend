import api from './api';

export const dashboardService = {
  getStats: () => api.get('/api/admin/dashboard/stats'),
};
