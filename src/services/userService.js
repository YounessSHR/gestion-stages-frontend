import api from './api';

export const userService = {
  getMyProfile: () => api.get('/api/users/me'),
  
  updateMyProfile: (data) => api.put('/api/users/me', data),
  
  changePassword: (data) => api.put('/api/users/me/password', data),
  
  getUserById: (id) => api.get(`/api/users/${id}`),
};
