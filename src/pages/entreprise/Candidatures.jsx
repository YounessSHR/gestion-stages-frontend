import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { candidatureService } from '../../services/candidatureService';
import { offreService } from '../../services/offreService';
import { cvService } from '../../services/cvService';
import { toast } from 'react-toastify';

const Candidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    loadCandidatures();
  }, []);

  const loadCandidatures = async () => {
    try {
      // Récupérer les offres de l'entreprise
      const offresRes = await offreService.getMyOffres();
      const offres = offresRes.data;
      
      // Récupérer les candidatures pour chaque offre
      const allCandidatures = [];
      for (const offre of offres) {
        try {
          const candidaturesRes = await candidatureService.getByOffre(offre.id);
          allCandidatures.push(...candidaturesRes.data);
        } catch (e) {
          // Ignorer les erreurs
        }
      }
      setCandidatures(allCandidatures);
    } catch (error) {
      toast.error('Erreur lors du chargement des candidatures');
      setCandidatures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    if (!window.confirm('Voulez-vous accepter cette candidature ?')) return;

    setProcessing(prev => new Set(prev).add(id));
    try {
      await candidatureService.accept(id);
      toast.success('Candidature acceptée !');
      await loadCandidatures();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'acceptation');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleReject = async (id) => {
    const commentaire = window.prompt('Raison du refus (optionnel):');
    if (commentaire === null) return;

    setProcessing(prev => new Set(prev).add(id));
    try {
      await candidatureService.reject(id, commentaire);
      toast.success('Candidature refusée');
      await loadCandidatures();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du refus');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDownloadCV = async (etudiantId, etudiantNom, etudiantPrenom) => {
    try {
      const response = await cvService.downloadStudentCV(etudiantId);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV_${etudiantNom}_${etudiantPrenom}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CV téléchargé avec succès');
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Cet étudiant n\'a pas de CV');
      } else {
        toast.error('Erreur lors du téléchargement du CV');
      }
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'ACCEPTEE': return 'bg-green-100 text-green-800';
      case 'REFUSEE': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Candidatures reçues</h1>
        <p className="text-sm text-linkedin-gray-600">Gérez les candidatures pour vos offres</p>
      </div>
      
      <div className="space-y-4">
        {candidatures.map((candidature) => (
          <div key={candidature.id} className="card-linkedin">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {candidature.etudiantPrenom} {candidature.etudiantNom}
                </h3>
                <p className="text-gray-600 mb-2 font-medium">{candidature.offreTitre}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {candidature.etudiantNiveau} - {candidature.etudiantFiliere}
                </p>
                {candidature.lettreMotivation && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {candidature.lettreMotivation.substring(0, 200)}...
                  </p>
                )}
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(candidature.statut)}`}>
                  {candidature.statut}
                </span>
              </div>
              <div className="flex gap-2">
                {candidature.etudiantId && (
                  <button
                    onClick={() => handleDownloadCV(candidature.etudiantId, candidature.etudiantNom, candidature.etudiantPrenom)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                    title="Télécharger le CV"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    CV
                  </button>
                )}
                {candidature.statut === 'EN_ATTENTE' && (
                  <>
                    <button
                      onClick={() => handleAccept(candidature.id)}
                      disabled={processing.has(candidature.id)}
                      className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                    >
                      {processing.has(candidature.id) ? 'Traitement...' : 'Accepter'}
                    </button>
                    <button
                      onClick={() => handleReject(candidature.id)}
                      disabled={processing.has(candidature.id)}
                      className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                    >
                      {processing.has(candidature.id) ? 'Traitement...' : 'Refuser'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {candidatures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune candidature reçue</p>
        </div>
      )}
    </div>
  );
};

export default Candidatures;
