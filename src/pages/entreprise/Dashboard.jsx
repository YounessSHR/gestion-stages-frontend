import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { offreService } from '../../services/offreService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({ offres: 0, candidatures: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await offreService.getMyOffres();
      const totalCandidatures = response.data.reduce((sum, offre) => sum + (offre.nombreCandidatures || 0), 0);
      setStats({
        offres: response.data.length,
        candidatures: totalCandidatures
      });
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
        <p className="text-sm text-linkedin-gray-600">Vue d'ensemble de votre activité</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card-linkedin">
          <h3 className="text-lg font-semibold mb-2 text-linkedin-dark">Mes offres</h3>
          <p className="text-3xl font-bold text-linkedin-primary mb-4">{stats.offres}</p>
          <Link to="/entreprise/offres" className="text-sm font-semibold text-linkedin-primary hover:underline inline-flex items-center gap-1">
            Gérer mes offres
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="card-linkedin">
          <h3 className="text-lg font-semibold mb-2 text-linkedin-dark">Candidatures reçues</h3>
          <p className="text-3xl font-bold text-linkedin-secondary mb-4">{stats.candidatures}</p>
          <Link to="/entreprise/candidatures" className="text-sm font-semibold text-linkedin-primary hover:underline inline-flex items-center gap-1">
            Voir les candidatures
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="card-linkedin">
        <h2 className="text-lg font-semibold mb-4 text-linkedin-dark">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/entreprise/offres/nouvelle"
            className="btn-linkedin-primary"
          >
            Créer une offre
          </Link>
          <Link
            to="/entreprise/candidatures"
            className="btn-linkedin-secondary"
          >
            Voir candidatures
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
