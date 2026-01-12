import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { offreService } from '../../services/offreService';
import { toast } from 'react-toastify';

const Offres = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    loadOffres();
  }, []);

  const loadOffres = async () => {
    try {
      const response = await offreService.getAllForAdmin();
      // Filtrer seulement les offres en attente
      const pending = response.data.filter(o => o.statut === 'EN_ATTENTE');
      setOffres(pending);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    if (!window.confirm('Voulez-vous valider cette offre ?')) return;

    setProcessing(prev => new Set(prev).add(id));
    try {
      await offreService.validate(id);
      toast.success('Offre validée !');
      await loadOffres();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la validation');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Validation des offres</h1>
        <p className="text-sm text-linkedin-gray-600">Validez ou refusez les offres en attente</p>
      </div>
      
      <div className="space-y-4">
        {offres.map((offre) => (
          <div key={offre.id} className="card-linkedin">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{offre.titre}</h3>
                <p className="text-gray-600 mb-2 font-medium">{offre.nomEntreprise}</p>
                <p className="text-sm text-gray-500 mb-2">{offre.typeOffre}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{offre.description?.substring(0, 200)}...</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  EN_ATTENTE
                </span>
              </div>
              <button
                onClick={() => handleValidate(offre.id)}
                disabled={processing.has(offre.id)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center gap-2"
              >
                {processing.has(offre.id) ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validation...
                  </>
                ) : (
                  'Valider'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {offres.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune offre en attente de validation</p>
        </div>
      )}
    </div>
  );
};

export default Offres;
