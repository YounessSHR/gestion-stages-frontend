import api from './api';

export const suiviService = {
  assignerTuteur: (data) => api.post('/api/suivis/assigner-tuteur', data),
  
  getAll: () => api.get('/api/suivis'),
  
  getById: (id) => api.get(`/api/suivis/${id}`),
  
  getMesEtudiants: () => api.get('/api/suivis/mes-etudiants'),
  
  getMonStage: () => api.get('/api/suivis/mon-stage'),
  
  updateAvancement: (id, data) => api.put(`/api/suivis/${id}/avancement`, data),
};
