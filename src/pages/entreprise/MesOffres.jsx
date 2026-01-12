import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { offreService } from '../../services/offreService';
import { toast } from 'react-toastify';

const MesOffres = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffres();
  }, []);

  const loadOffres = async () => {
    try {
      const response = await offreService.getMyOffres();
      setOffres(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cette offre ?')) return;

    try {
      await offreService.delete(id);
      toast.success('Offre supprimée');
      loadOffres();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'VALIDEE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Mes offres</h1>
          <p className="text-sm text-linkedin-gray-600">Gérez vos offres de stage et alternance</p>
        </div>
        <Link
          to="/entreprise/offres/nouvelle"
          className="btn-linkedin-primary"
        >
          Nouvelle offre
        </Link>
      </div>
      
      <div className="space-y-4">
        {offres.map((offre) => (
          <div key={offre.id} className="card-linkedin">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{offre.titre}</h3>
                <p className="text-gray-600 mb-2 font-medium">{offre.typeOffre}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{offre.description?.substring(0, 150)}...</p>
                <div className="flex gap-4 items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(offre.statut)}`}>
                    {offre.statut}
                  </span>
                  <span className="text-sm text-gray-600">
                    {offre.nombreCandidatures || 0} candidature(s)
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/entreprise/offres/${offre.id}/edit`}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(offre.id)}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {offres.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucune offre</p>
          <Link
            to="/entreprise/offres/nouvelle"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Créer ma première offre
          </Link>
        </div>
      )}
    </div>
  );
};

export default MesOffres;
