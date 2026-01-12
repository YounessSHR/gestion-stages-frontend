import { useEffect, useState } from 'react';
import { conventionService } from '../../services/conventionService';
import { suiviService } from '../../services/suiviService';
import { toast } from 'react-toastify';

const Suivis = () => {
  const [conventions, setConventions] = useState([]);
  const [selectedConvention, setSelectedConvention] = useState(null);
  const [tuteurId, setTuteurId] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await conventionService.getAll();
      const signed = response.data.filter(c => c.statut === 'SIGNEE');
      setConventions(signed);
      
      // Charger tous les suivis pour vérifier quelles conventions ont déjà un tuteur
      const suivisRes = await suiviService.getAll();
      const conventionsAvecSuivi = new Set(suivisRes.data.map(s => s.conventionId));
      const conventionsSansTuteur = signed.filter(c => !conventionsAvecSuivi.has(c.id));
      setConventions(conventionsSansTuteur);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleAssigner = async () => {
    if (!tuteurId || !selectedConvention) {
      toast.error('Veuillez sélectionner une convention et un tuteur');
      return;
    }

    setProcessing(true);
    try {
      await suiviService.assignerTuteur({
        conventionId: selectedConvention.id,
        tuteurId: parseInt(tuteurId)
      });
      toast.success('Tuteur assigné avec succès !');
      setSelectedConvention(null);
      setTuteurId('');
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'assignation');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Assignation de tuteurs</h1>
        <p className="text-sm text-linkedin-gray-600">Assignez des tuteurs aux conventions signées</p>
      </div>
      
      {selectedConvention && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Assigner un tuteur à:</h3>
          <p>{selectedConvention.etudiantPrenom} {selectedConvention.etudiantNom} - {selectedConvention.entrepriseNom}</p>
          <div className="mt-4 flex gap-4">
            <input
              type="number"
              placeholder="ID du tuteur (ex: 1, 2, 3...)"
              value={tuteurId}
              onChange={(e) => setTuteurId(e.target.value)}
              className="border rounded px-4 py-2"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Entrez l'ID du tuteur. Vous pouvez trouver les IDs des tuteurs dans la base de données.
            </p>
            <button
              onClick={handleAssigner}
              disabled={processing}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center gap-2"
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assignation...
                </>
              ) : (
                'Assigner'
              )}
            </button>
            <button
              onClick={() => setSelectedConvention(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {conventions.map((convention) => (
          <div key={convention.id} className="card-linkedin">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  {convention.etudiantPrenom} {convention.etudiantNom}
                </h3>
                <p className="text-gray-600 mb-2">{convention.entrepriseNom}</p>
                <p className="text-sm text-gray-500">Convention signée - Prête pour assignation</p>
              </div>
              {!selectedConvention && (
                <button
                  onClick={() => setSelectedConvention(convention)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Assigner tuteur
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {conventions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune convention signée sans tuteur</p>
        </div>
      )}
    </div>
  );
};

export default Suivis;
