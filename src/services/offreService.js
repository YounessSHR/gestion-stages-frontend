import api from './api';

export const offreService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.typeOffre) params.append('typeOffre', filters.typeOffre);
    if (filters.dateDebutMin) params.append('dateDebutMin', filters.dateDebutMin);
    if (filters.dateDebutMax) params.append('dateDebutMax', filters.dateDebutMax);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
    params.append('page', filters.page || 0);
    params.append('size', filters.size || 10);
    return api.get(`/api/offres/publiques?${params.toString()}`);
  },
  
  getAllForAdmin: () => api.get('/api/offres/all'),
  
  getById: (id) => api.get(`/api/offres/${id}`),
  
  search: (titre) => api.get(`/api/offres/search?titre=${titre}`),
  
  create: (data) => api.post('/api/offres', data),
  
  update: (id, data) => api.put(`/api/offres/${id}`, data),
  
  delete: (id) => api.delete(`/api/offres/${id}`),
  
  validate: (id) => api.put(`/api/offres/${id}/valider`),
  
  getMyOffres: () => api.get('/api/offres/mes-offres'),
};
