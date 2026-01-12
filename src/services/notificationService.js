import api from './api';

export const notificationService = {
  getAll: () => api.get('/api/notifications'),
  
  getPage: (page = 0, size = 10) => api.get(`/api/notifications/page?page=${page}&size=${size}`),
  
  getCount: () => api.get('/api/notifications/count'),
  
  marquerCommeLu: (id) => api.put(`/api/notifications/${id}/lu`),
  
  marquerToutesCommeLues: () => api.put('/api/notifications/toutes-lues'),
};
