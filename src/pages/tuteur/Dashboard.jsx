import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { suiviService } from '../../services/suiviService';
import { toast } from 'react-toastify';

const Dashboard = () => {
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

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Tableau de bord</h1>
        <p className="text-sm text-linkedin-gray-600">Gestion de vos étudiants en stage</p>
      </div>
      
      <div className="card-linkedin mb-6">
        <h2 className="text-lg font-semibold mb-4 text-linkedin-dark">Mes étudiants ({etudiants.length})</h2>
        <Link
          to="/tuteur/etudiants"
          className="text-sm font-semibold text-linkedin-primary hover:underline inline-flex items-center gap-1"
        >
          Voir tous mes étudiants
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {etudiants.slice(0, 3).map((suivi) => (
          <div key={suivi.id} className="card-linkedin">
            <h3 className="text-lg font-semibold mb-2 text-linkedin-dark">
              {suivi.etudiantPrenom} {suivi.etudiantNom}
            </h3>
            <p className="text-linkedin-gray-600 mb-2">{suivi.entrepriseNom}</p>
            <p className="text-sm text-linkedin-gray-500 mb-4">État: {suivi.etatAvancement}</p>
            <Link
              to={`/tuteur/etudiants/${suivi.id}`}
              className="text-sm font-semibold text-linkedin-primary hover:underline inline-flex items-center gap-1"
            >
              Voir le suivi
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
