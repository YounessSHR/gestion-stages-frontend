import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
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
        <p className="text-sm text-linkedin-gray-600">Vue d'ensemble de la plateforme</p>
      </div>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card-linkedin">
            <h3 className="text-lg font-semibold mb-2 text-linkedin-dark">Offres</h3>
            <p className="text-3xl font-bold text-linkedin-primary mb-2">{stats.totalOffres || 0}</p>
            <p className="text-sm text-linkedin-gray-600">{stats.offresEnAttente || 0} en attente</p>
          </div>
          
          <div className="card-linkedin">
            <h3 className="text-lg font-semibold mb-2 text-linkedin-dark">Candidatures</h3>
            <p className="text-3xl font-bold text-linkedin-secondary mb-2">{stats.totalCandidatures || 0}</p>
            <p className="text-sm text-linkedin-gray-600">{stats.candidaturesEnAttente || 0} en attente</p>
          </div>
          
          <div className="card-linkedin">
            <h3 className="text-lg font-semibold mb-2 text-linkedin-dark">Conventions</h3>
            <p className="text-3xl font-bold text-purple-600 mb-2">{stats.totalConventions || 0}</p>
            <p className="text-sm text-linkedin-gray-600">{stats.conventionsSignees || 0} signées</p>
          </div>
          
          <div className="card-linkedin">
            <h3 className="text-lg font-semibold mb-2 text-linkedin-dark">Stages actifs</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.stagesActifs || 0}</p>
          </div>
        </div>
      )}

      <div className="card-linkedin">
        <h2 className="text-lg font-semibold mb-4 text-linkedin-dark">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/offres"
            className="btn-linkedin-primary"
          >
            Valider des offres
          </Link>
          <Link
            to="/admin/conventions"
            className="btn-linkedin-secondary"
          >
            Gérer les conventions
          </Link>
          <Link
            to="/admin/suivis"
            className="btn-linkedin-secondary"
          >
            Assigner des tuteurs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
