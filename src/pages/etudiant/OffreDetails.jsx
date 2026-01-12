import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { offreService } from '../../services/offreService';
import { candidatureService } from '../../services/candidatureService';
import { toast } from 'react-toastify';

const OffreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postulating, setPostulating] = useState(false);
  const [lettreMotivation, setLettreMotivation] = useState('');

  useEffect(() => {
    loadOffre();
  }, [id]);

  const loadOffre = async () => {
    try {
      const response = await offreService.getById(id);
      setOffre(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'offre');
      navigate('/etudiant/offres');
    } finally {
      setLoading(false);
    }
  };

  const handlePostuler = async () => {
    if (!lettreMotivation.trim()) {
      toast.error('Veuillez rédiger une lettre de motivation');
      return;
    }

    setPostulating(true);
    try {
      await candidatureService.create({
        offreId: parseInt(id),
        lettreMotivation: lettreMotivation.trim()
      });
      toast.success('Candidature envoyée avec succès !');
      navigate('/etudiant/candidatures');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la candidature');
    } finally {
      setPostulating(false);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (!offre) return <div className="p-4">Offre non trouvée</div>;

  return (
    <div className="py-6">
      <div className="card-linkedin mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-4">{offre.titre}</h1>
        <div className="flex gap-4 text-gray-600 mb-4">
          <span className="font-semibold">{offre.nomEntreprise}</span>
          <span>•</span>
          <span>{offre.typeOffre}</span>
          {offre.duree && (
            <>
              <span>•</span>
              <span>{offre.duree} mois</span>
            </>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{offre.description}</p>
        </div>

        {offre.competencesRequises && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Compétences requises</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{offre.competencesRequises}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {offre.dateDebut && (
            <div>
              <strong>Date de début:</strong> {new Date(offre.dateDebut).toLocaleDateString()}
            </div>
          )}
          {offre.dateFin && (
            <div>
              <strong>Date de fin:</strong> {new Date(offre.dateFin).toLocaleDateString()}
            </div>
          )}
          {offre.remuneration && (
            <div>
              <strong>Rémunération:</strong> {offre.remuneration}
            </div>
          )}
        </div>
      </div>

      <div className="card-linkedin">
        <h2 className="text-xl font-semibold mb-4">Postuler à cette offre</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lettre de motivation *</label>
            <textarea
              value={lettreMotivation}
              onChange={(e) => setLettreMotivation(e.target.value)}
              rows="8"
              className="w-full border rounded px-3 py-2"
              placeholder="Rédigez votre lettre de motivation..."
              required
            />
          </div>
          <button
            onClick={handlePostuler}
            disabled={postulating || !lettreMotivation.trim()}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center gap-2"
          >
            {postulating ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </>
            ) : (
              'Envoyer ma candidature'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffreDetails;
