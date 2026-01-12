import { useEffect, useState } from 'react';
import { candidatureService } from '../../services/candidatureService';
import { toast } from 'react-toastify';

const MesCandidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    loadCandidatures();
  }, []);

  const loadCandidatures = async () => {
    try {
      const response = await candidatureService.getMyCandidatures();
      setCandidatures(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cette candidature ?')) return;

    setProcessing(prev => new Set(prev).add(id));
    try {
      await candidatureService.delete(id);
      toast.success('Candidature supprimée');
      await loadCandidatures();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Mes candidatures</h1>
        <p className="text-sm text-linkedin-gray-600">Suivez l'état de vos candidatures</p>
      </div>
      
      <div className="space-y-4">
        {candidatures.map((candidature) => (
          <div key={candidature.id} className="card-linkedin">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{candidature.offreTitre}</h3>
                <p className="text-gray-600 mb-2">{candidature.entrepriseNom}</p>
                <p className="text-sm text-gray-500 mb-4">{candidature.offreTypeOffre}</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(candidature.statut)}`}>
                  {candidature.statut}
                </span>
              </div>
              <div className="flex gap-2">
                {candidature.statut === 'EN_ATTENTE' && (
                  <button
                    onClick={() => handleDelete(candidature.id)}
                    disabled={processing.has(candidature.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center gap-2"
                  >
                    {processing.has(candidature.id) ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Suppression...
                      </>
                    ) : (
                      'Supprimer'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {candidatures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune candidature</p>
        </div>
      )}
    </div>
  );
};

export default MesCandidatures;
