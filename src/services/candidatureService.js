import api from './api';

export const candidatureService = {
  create: (data) => api.post('/api/candidatures', data),
  
  getById: (id) => api.get(`/api/candidatures/${id}`),
  
  getMyCandidatures: () => api.get('/api/candidatures/mes-candidatures'),
  
  getByOffre: (offreId) => api.get(`/api/candidatures/offre/${offreId}`),
  
  accept: (id) => api.put(`/api/candidatures/${id}/accepter`),
  
  reject: (id, commentaire) => api.put(`/api/candidatures/${id}/refuser`, { commentaire }),
  
  delete: (id) => api.delete(`/api/candidatures/${id}`),
};
