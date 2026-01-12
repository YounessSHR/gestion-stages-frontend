import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { offreService } from '../../services/offreService';
import { candidatureService } from '../../services/candidatureService';
import { suiviService } from '../../services/suiviService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({ offres: 0, candidatures: 0, stage: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [offresRes, candidaturesRes, stageRes] = await Promise.all([
        offreService.getAll(),
        candidatureService.getMyCandidatures(),
        suiviService.getMonStage().catch(() => null)
      ]);

      setStats({
        offres: offresRes.data.length,
        candidatures: candidaturesRes.data.length,
        stage: stageRes?.data || null
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="card-linkedin animate-pulse">
          <div className="h-8 bg-linkedin-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-linkedin-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Tableau de bord</h1>
        <p className="text-sm text-linkedin-gray-600">Bienvenue, consultez vos statistiques et actions rapides</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Stat Card 1 */}
        <div className="card-linkedin">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-linkedin-gray-600 mb-1">Offres disponibles</p>
              <p className="text-3xl font-semibold text-linkedin-dark">{stats.offres}</p>
            </div>
            <div className="w-12 h-12 bg-linkedin-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-linkedin-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <Link 
            to="/etudiant/offres" 
            className="text-sm font-semibold text-linkedin-primary hover:underline inline-flex items-center gap-1"
          >
            Voir toutes les offres
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Stat Card 2 */}
        <div className="card-linkedin">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-linkedin-gray-600 mb-1">Mes candidatures</p>
              <p className="text-3xl font-semibold text-linkedin-dark">{stats.candidatures}</p>
            </div>
            <div className="w-12 h-12 bg-linkedin-secondary/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-linkedin-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Link 
            to="/etudiant/candidatures" 
            className="text-sm font-semibold text-linkedin-primary hover:underline inline-flex items-center gap-1"
          >
            Voir mes candidatures
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Stat Card 3 */}
        <div className="card-linkedin">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-linkedin-gray-600 mb-1">Mon stage</p>
              {stats.stage ? (
                <p className="text-lg font-semibold text-linkedin-dark">Actif</p>
              ) : (
                <p className="text-lg font-semibold text-linkedin-gray-500">Aucun stage</p>
              )}
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          {stats.stage ? (
            <Link 
              to="/etudiant/stage" 
              className="text-sm font-semibold text-linkedin-primary hover:underline inline-flex items-center gap-1"
            >
              Voir le suivi
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span className="text-sm text-linkedin-gray-500">Aucun stage actif</span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-linkedin">
        <h2 className="text-lg font-semibold text-linkedin-dark mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/etudiant/offres"
            className="btn-linkedin-primary"
          >
            Rechercher des offres
          </Link>
          <Link
            to="/etudiant/candidatures"
            className="btn-linkedin-secondary"
          >
            Mes candidatures
          </Link>
          <Link
            to="/etudiant/conventions"
            className="btn-linkedin-secondary"
          >
            Mes conventions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
