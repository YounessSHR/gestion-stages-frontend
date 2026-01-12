import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { offreService } from '../../services/offreService';
import { toast } from 'react-toastify';

const Offres = () => {
  const navigate = useNavigate();
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeOffre, setTypeOffre] = useState('');
  const [dateDebutMin, setDateDebutMin] = useState('');
  const [dateDebutMax, setDateDebutMax] = useState('');
  const [sortBy, setSortBy] = useState('datePublication');
  const [sortDirection, setSortDirection] = useState('DESC');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadOffres();
  }, [page, sortBy, sortDirection]);

  const loadOffres = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchTerm || undefined,
        typeOffre: typeOffre || undefined,
        dateDebutMin: dateDebutMin || undefined,
        dateDebutMax: dateDebutMax || undefined,
        sortBy,
        sortDirection,
        page,
        size
      };
      
      const response = await offreService.getAll(filters);
      setOffres(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      toast.error('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0); // Reset to first page
    loadOffres();
  };

  const handleFilterChange = () => {
    setPage(0);
    loadOffres();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && page === 0) {
    return (
      <div className="py-6">
        <div className="card-linkedin animate-pulse">
          <div className="h-8 bg-linkedin-gray-200 rounded w-1/3 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Offres de stage et alternance</h1>
        <p className="text-sm text-linkedin-gray-600">Découvrez les opportunités disponibles</p>
      </div>

      {/* Filters */}
      <div className="card-linkedin mb-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-linkedin-dark mb-3">Filtres</h3>
          
          {/* Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-linkedin-gray-700 mb-1">Recherche</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-linkedin-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Titre, description, compétences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary"
                />
              </div>
              <button onClick={handleSearch} className="btn-linkedin-primary">
                Rechercher
              </button>
            </div>
          </div>

          {/* Other Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-linkedin-gray-700 mb-1">Type</label>
              <select
                value={typeOffre}
                onChange={(e) => {
                  setTypeOffre(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-2 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary"
              >
                <option value="">Tous</option>
                <option value="STAGE">Stage</option>
                <option value="ALTERNANCE">Alternance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-linkedin-gray-700 mb-1">Date début min</label>
              <input
                type="date"
                value={dateDebutMin}
                onChange={(e) => {
                  setDateDebutMin(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-2 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-linkedin-gray-700 mb-1">Date début max</label>
              <input
                type="date"
                value={dateDebutMax}
                onChange={(e) => {
                  setDateDebutMax(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-2 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-linkedin-gray-700 mb-1">Trier par</label>
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDirection(direction);
                }}
                className="w-full px-3 py-2 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary"
              >
                <option value="datePublication-DESC">Plus récentes</option>
                <option value="datePublication-ASC">Plus anciennes</option>
                <option value="dateDebut-ASC">Date début (croissant)</option>
                <option value="dateDebut-DESC">Date début (décroissant)</option>
                <option value="remuneration-DESC">Rémunération (décroissant)</option>
                <option value="remuneration-ASC">Rémunération (croissant)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="mb-4 text-sm text-linkedin-gray-600">
          {totalElements} offre{totalElements !== 1 ? 's' : ''} trouvée{totalElements !== 1 ? 's' : ''}
        </div>
      )}

      {/* Offers Grid */}
      {loading ? (
        <div className="card-linkedin animate-pulse">
          <div className="h-32 bg-linkedin-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mb-6">
          {offres.map((offre) => (
            <div key={offre.id} className="card-linkedin hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-linkedin-dark mb-2 line-clamp-2">{offre.titre}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-linkedin-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-linkedin-primary font-semibold text-xs">
                      {offre.nomEntreprise?.[0]?.toUpperCase() || 'E'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-linkedin-dark">{offre.nomEntreprise}</p>
                    <p className="text-xs text-linkedin-gray-600">{offre.typeOffre}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-linkedin-gray-600 mb-4 line-clamp-3">{offre.description}</p>
              
              <button
                onClick={() => navigate(`/etudiant/offres/${offre.id}`)}
                className="w-full btn-linkedin-primary text-sm"
              >
                Voir détails et postuler
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 border border-linkedin-gray-300 rounded-md hover:bg-linkedin-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          <div className="flex gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (page < 3) {
                pageNum = i;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-md ${
                    page === pageNum
                      ? 'bg-linkedin-primary text-white'
                      : 'border border-linkedin-gray-300 hover:bg-linkedin-gray-100'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 border border-linkedin-gray-300 rounded-md hover:bg-linkedin-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}

      {!loading && offres.length === 0 && (
        <div className="card-linkedin text-center py-12">
          <svg className="w-16 h-16 text-linkedin-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-linkedin-gray-600 font-medium">Aucune offre trouvée</p>
          <p className="text-sm text-linkedin-gray-500 mt-1">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
};

export default Offres;
