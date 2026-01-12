import api from './api';

export const conventionService = {
  getAll: () => api.get('/api/conventions'),
  
  getById: (id) => api.get(`/api/conventions/${id}`),
  
  getMyConventions: () => api.get('/api/conventions/mes-conventions'),
  
  getByEtudiant: () => api.get('/api/conventions/etudiant'),
  
  getByEntreprise: () => api.get('/api/conventions/entreprise'),
  
  signerEtudiant: (id) => api.put(`/api/conventions/${id}/signer-etudiant`),
  
  signerEntreprise: (id) => api.put(`/api/conventions/${id}/signer-entreprise`),
  
  signerAdmin: (id) => api.put(`/api/conventions/${id}/signer-admin`),
  
  genererPdf: (id) => api.post(`/api/conventions/${id}/generer-pdf`),
  
  downloadPdf: (id) => api.get(`/api/conventions/${id}/pdf`, { responseType: 'blob' }),
  
  archiver: (id) => api.put(`/api/conventions/${id}/archiver`),
};
