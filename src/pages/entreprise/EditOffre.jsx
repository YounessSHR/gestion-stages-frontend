import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { offreService } from '../../services/offreService';
import { toast } from 'react-toastify';

const EditOffre = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    typeOffre: 'STAGE',
    duree: '',
    dateDebut: '',
    dateFin: '',
    competencesRequises: '',
    remuneration: ''
  });

  useEffect(() => {
    loadOffre();
  }, [id]);

  const loadOffre = async () => {
    try {
      // Pour modifier, on doit récupérer depuis mes-offres car getById ne retourne que les validées
      const response = await offreService.getMyOffres();
      const offre = response.data.find(o => o.id === parseInt(id));
      
      if (!offre) {
        toast.error('Offre non trouvée');
        navigate('/entreprise/offres');
        return;
      }

      setFormData({
        titre: offre.titre || '',
        description: offre.description || '',
        typeOffre: offre.typeOffre || 'STAGE',
        duree: offre.duree || '',
        dateDebut: offre.dateDebut || '',
        dateFin: offre.dateFin || '',
        competencesRequises: offre.competencesRequises || '',
        remuneration: offre.remuneration || ''
      });
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'offre');
      navigate('/entreprise/offres');
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
      await offreService.update(id, formData);
      toast.success('Offre modifiée avec succès !');
      navigate('/entreprise/offres');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Modifier l'offre</h1>
        <p className="text-sm text-linkedin-gray-600">Modifiez les détails de votre offre</p>
      </div>

      <form onSubmit={handleSubmit} className="card-linkedin">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre *</label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type d'offre *</label>
              <select
                name="typeOffre"
                value={formData.typeOffre}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="STAGE">Stage</option>
                <option value="ALTERNANCE">Alternance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Durée (en mois)</label>
              <input
                type="number"
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date de début *</label>
              <input
                type="date"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date de fin *</label>
              <input
                type="date"
                name="dateFin"
                value={formData.dateFin}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rémunération</label>
              <input
                type="text"
                name="remuneration"
                value={formData.remuneration}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Ex: 600€/mois"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Compétences requises</label>
            <textarea
              name="competencesRequises"
              value={formData.competencesRequises}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded px-3 py-2"
              placeholder="Listez les compétences requises..."
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
              'Enregistrer les modifications'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/entreprise/offres')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOffre;
