import api from './api';

export const cvService = {
  // Upload CV (FormData with file)
  uploadCV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/cv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Download my CV
  downloadMyCV: () => {
    return api.get('/api/cv/download', {
      responseType: 'blob',
    });
  },

  // Download student CV (for enterprises)
  downloadStudentCV: (etudiantId) => {
    return api.get(`/api/cv/${etudiantId}`, {
      responseType: 'blob',
    });
  },

  // Delete my CV
  deleteCV: () => api.delete('/api/cv'),
};
