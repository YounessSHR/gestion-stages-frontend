import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { suiviService } from '../../services/suiviService';
import { toast } from 'react-toastify';

const UpdateSuivi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suivi, setSuivi] = useState(null);
  const [formData, setFormData] = useState({
    etatAvancement: 'EN_COURS',
    commentaires: '',
    derniereVisite: ''
  });

  useEffect(() => {
    loadSuivi();
  }, [id]);

  const loadSuivi = async () => {
    try {
      const response = await suiviService.getById(id);
      setSuivi(response.data);
      setFormData({
        etatAvancement: response.data.etatAvancement || 'EN_COURS',
        commentaires: response.data.commentaires || '',
        derniereVisite: response.data.derniereVisite ? response.data.derniereVisite.split('T')[0] : ''
      });
    } catch (error) {
      toast.error('Erreur lors du chargement');
      navigate('/tuteur/etudiants');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await suiviService.updateAvancement(id, formData);
      toast.success('Suivi mis à jour avec succès !');
      navigate('/tuteur/etudiants');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (!suivi) return <div className="p-4">Suivi non trouvé</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Mettre à jour le suivi</h1>
        <p className="text-sm text-linkedin-gray-600">Suivez l'avancement du stage de l'étudiant</p>
      </div>

      <div className="card-linkedin mb-6">
        <h2 className="text-xl font-semibold mb-4">Informations de l'étudiant</h2>
        <div className="space-y-2">
          <p><strong>Étudiant:</strong> {suivi.etudiantPrenom} {suivi.etudiantNom}</p>
          <p><strong>Entreprise:</strong> {suivi.entrepriseNom}</p>
          <p><strong>Période:</strong> {suivi.dateDebut && new Date(suivi.dateDebut).toLocaleDateString()} - {suivi.dateFin && new Date(suivi.dateFin).toLocaleDateString()}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-linkedin">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">État d'avancement *</label>
            <select
              name="etatAvancement"
              value={formData.etatAvancement}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
              <option value="EN_DIFFICULTE">En difficulté</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dernière visite</label>
            <input
              type="date"
              name="derniereVisite"
              value={formData.derniereVisite}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Commentaires</label>
            <textarea
              name="commentaires"
              value={formData.commentaires}
              onChange={handleChange}
              rows="6"
              className="w-full border rounded px-3 py-2"
              placeholder="Notes sur l'avancement du stage..."
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tuteur/etudiants')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSuivi;
