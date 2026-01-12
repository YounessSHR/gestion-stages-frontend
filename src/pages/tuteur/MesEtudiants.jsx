import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { suiviService } from '../../services/suiviService';
import { toast } from 'react-toastify';

const MesEtudiants = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEtudiants();
  }, []);

  const loadEtudiants = async () => {
    try {
      const response = await suiviService.getMesEtudiants();
      setEtudiants(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getEtatColor = (etat) => {
    switch (etat) {
      case 'TERMINE': return 'bg-green-100 text-green-800';
      case 'EN_COURS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Mes étudiants</h1>
        <p className="text-sm text-linkedin-gray-600">Gérez le suivi de vos étudiants en stage</p>
      </div>
      
      <div className="space-y-4">
        {etudiants.map((suivi) => (
          <div key={suivi.id} className="card-linkedin">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  {suivi.etudiantPrenom} {suivi.etudiantNom}
                </h3>
                <p className="text-gray-600 mb-2">{suivi.entrepriseNom}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {suivi.dateDebut && new Date(suivi.dateDebut).toLocaleDateString()} - 
                  {suivi.dateFin && new Date(suivi.dateFin).toLocaleDateString()}
                </p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEtatColor(suivi.etatAvancement)}`}>
                  {suivi.etatAvancement}
                </span>
                {suivi.commentaires && (
                  <p className="text-sm text-gray-600 mt-2">{suivi.commentaires}</p>
                )}
              </div>
              <Link
                to={`/tuteur/etudiants/${suivi.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Mettre à jour
              </Link>
            </div>
          </div>
        ))}
      </div>

      {etudiants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun étudiant assigné</p>
        </div>
      )}
    </div>
  );
};

export default MesEtudiants;
