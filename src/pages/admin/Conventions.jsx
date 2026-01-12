import { useEffect, useState } from 'react';
import { conventionService } from '../../services/conventionService';
import { toast } from 'react-toastify';

const Conventions = () => {
  const [conventions, setConventions] = useState([]);
  const [archivedConventions, setArchivedConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadConventions();
  }, []);

  const loadConventions = async () => {
    try {
      const response = await conventionService.getAll();
      // Séparer les conventions archivées et non archivées
      // L'archivage change le statut à 'ARCHIVEE' au lieu d'utiliser un champ booléen
      const nonArchivees = response.data.filter(c => c.statut !== 'ARCHIVEE');
      const archivees = response.data.filter(c => c.statut === 'ARCHIVEE');
      setConventions(nonArchivees);
      setArchivedConventions(archivees);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSigner = async (id) => {
    if (!window.confirm('Voulez-vous signer cette convention ?')) return;

    setProcessing(prev => new Set(prev).add(id));
    try {
      await conventionService.signerAdmin(id);
      toast.success('Convention signée !');
      await loadConventions();
    } catch (error) {
      toast.error('Erreur lors de la signature');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleArchiver = async (id) => {
    if (!window.confirm('Voulez-vous archiver cette convention ?')) return;

    const archiveId = `archive-${id}`;
    setProcessing(prev => new Set(prev).add(archiveId));
    try {
      await conventionService.archiver(id);
      toast.success('Convention archivée !');
      await loadConventions();
    } catch (error) {
      toast.error('Erreur lors de l\'archivage');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(archiveId);
        return newSet;
      });
    }
  };

  const handleDownloadPdf = async (id) => {
    const pdfId = `pdf-${id}`;
    setProcessing(prev => new Set(prev).add(pdfId));
    try {
      const response = await conventionService.downloadPdf(id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `convention_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(pdfId);
        return newSet;
      });
    }
  };

  if (loading) {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Gestion des conventions</h1>
          <p className="text-sm text-linkedin-gray-600">
            {showArchived ? 'Conventions archivées' : 'Conventions actives'}
          </p>
        </div>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="btn-linkedin-secondary"
        >
          {showArchived ? 'Voir actives' : `Voir archivées (${archivedConventions.length})`}
        </button>
      </div>
      
      {showArchived ? (
        <div>
          <div className="space-y-4">
            {archivedConventions.map((convention) => (
              <div key={convention.id} className="card-linkedin bg-linkedin-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {convention.etudiantPrenom} {convention.etudiantNom}
                    </h3>
                    <p className="text-linkedin-gray-600 mb-2 font-medium">{convention.entrepriseNom}</p>
                    <p className="text-sm text-linkedin-gray-500 mb-4">Statut: {convention.statut} - ARCHIVÉE</p>
                    <div className="flex gap-4 text-sm text-linkedin-gray-600">
                      <span className="text-sm">Étudiant: <span className={convention.signatureEtudiant ? 'text-linkedin-secondary font-semibold' : 'text-red-500'}>{convention.signatureEtudiant ? 'Signé' : 'Non signé'}</span></span>
                      <span className="text-sm">Entreprise: <span className={convention.signatureEntreprise ? 'text-linkedin-secondary font-semibold' : 'text-red-500'}>{convention.signatureEntreprise ? 'Signé' : 'Non signé'}</span></span>
                      <span className="text-sm">Admin: <span className={convention.signatureAdministration ? 'text-linkedin-secondary font-semibold' : 'text-red-500'}>{convention.signatureAdministration ? 'Signé' : 'Non signé'}</span></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {convention.fichierPdf && (
                      <button
                        onClick={() => handleDownloadPdf(convention.id)}
                        disabled={processing.has(`pdf-${convention.id}`)}
                        className="btn-linkedin-primary bg-linkedin-secondary hover:bg-linkedin-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {processing.has(`pdf-${convention.id}`) ? (
                          <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Télécharger PDF
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {archivedConventions.length === 0 && (
            <div className="card-linkedin text-center py-12">
              <svg className="w-16 h-16 text-linkedin-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-linkedin-gray-600 font-medium">Aucune convention archivée</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
        {conventions.map((convention) => (
          <div key={convention.id} className="card-linkedin">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  {convention.etudiantPrenom} {convention.etudiantNom}
                </h3>
                <p className="text-linkedin-gray-600 mb-2 font-medium">{convention.entrepriseNom}</p>
                <p className="text-sm text-linkedin-gray-500 mb-4">Statut: {convention.statut}</p>
                <div className="flex gap-4 text-sm text-linkedin-gray-600">
                  <span className="text-sm">Étudiant: <span className={convention.signatureEtudiant ? 'text-linkedin-secondary font-semibold' : 'text-red-500'}>{convention.signatureEtudiant ? 'Signé' : 'Non signé'}</span></span>
                  <span className="text-sm">Entreprise: <span className={convention.signatureEntreprise ? 'text-linkedin-secondary font-semibold' : 'text-red-500'}>{convention.signatureEntreprise ? 'Signé' : 'Non signé'}</span></span>
                  <span className="text-sm">Admin: <span className={convention.signatureAdministration ? 'text-linkedin-secondary font-semibold' : 'text-red-500'}>{convention.signatureAdministration ? 'Signé' : 'Non signé'}</span></span>
                </div>
              </div>
              <div className="flex gap-2">
                {!convention.signatureAdministration && (
                  <button
                    onClick={() => handleSigner(convention.id)}
                    disabled={processing.has(convention.id)}
                    className="btn-linkedin-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {processing.has(convention.id) ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signature...
                      </>
                    ) : (
                      'Signer'
                    )}
                  </button>
                )}
                {convention.fichierPdf && (
                  <button
                    onClick={() => handleDownloadPdf(convention.id)}
                    disabled={processing.has(`pdf-${convention.id}`)}
                    className="btn-linkedin-primary bg-linkedin-secondary hover:bg-linkedin-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {processing.has(`pdf-${convention.id}`) ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Téléchargement...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        PDF
                      </>
                    )}
                  </button>
                )}
                {convention.statut === 'SIGNEE' && (
                  <button
                    onClick={() => handleArchiver(convention.id)}
                    disabled={processing.has(`archive-${convention.id}`)}
                    className="btn-linkedin-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {processing.has(`archive-${convention.id}`) ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Archivage...
                      </>
                    ) : (
                      'Archiver'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
          {conventions.length === 0 && (
            <div className="card-linkedin text-center py-12">
              <svg className="w-16 h-16 text-linkedin-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-linkedin-gray-600 font-medium">Aucune convention active</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Conventions;
