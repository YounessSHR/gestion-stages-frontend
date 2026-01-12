import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { conventionService } from '../../services/conventionService';
import { toast } from 'react-toastify';

const MesConventions = () => {
  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    loadConventions();
  }, []);

  const loadConventions = async () => {
    try {
      const response = await conventionService.getByEntreprise();
      setConventions(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des conventions');
    } finally {
      setLoading(false);
    }
  };

  const handleSigner = async (id) => {
    if (!window.confirm('Voulez-vous signer cette convention ?')) return;

    setProcessing(prev => new Set(prev).add(id));
    try {
      await conventionService.signerEntreprise(id);
      toast.success('Convention signée avec succès !');
      await loadConventions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la signature');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
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
      toast.error('Erreur lors du téléchargement du PDF');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(pdfId);
        return newSet;
      });
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'SIGNEE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE_SIGNATURES': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVEE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Mes conventions</h1>
        <p className="text-sm text-linkedin-gray-600">Gérez vos conventions de stage</p>
      </div>
      
      <div className="space-y-4">
        {conventions.map((convention) => (
          <div key={convention.id} className="card-linkedin">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Convention #{convention.id}
                </h3>
                <p className="text-gray-600 mb-2 font-medium">
                  {convention.etudiantPrenom} {convention.etudiantNom}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {convention.offreTitre || 'Offre de stage'}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Période : {new Date(convention.dateDebutStage).toLocaleDateString('fr-FR')} - {new Date(convention.dateFinStage).toLocaleDateString('fr-FR')}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(convention.statut)}`}>
                    {convention.statut}
                  </span>
                </div>

                <div className="flex gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Étudiant:</span>
                    <span className={convention.signatureEtudiant ? 'text-linkedin-secondary font-semibold' : 'text-red-500'}>
                      {convention.signatureEtudiant ? 'Signé' : 'Non signé'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Entreprise:</span>
                    <span className={convention.signatureEntreprise ? 'text-linkedin-secondary font-semibold' : 'text-red-500'}>
                      {convention.signatureEntreprise ? 'Signé' : 'Non signé'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Admin:</span>
                    <span className={convention.signatureAdministration ? 'text-linkedin-secondary font-semibold' : 'text-red-500'}>
                      {convention.signatureAdministration ? 'Signé' : 'Non signé'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 flex-shrink-0">
                {!convention.signatureEntreprise && (
                  <button
                    onClick={() => handleSigner(convention.id)}
                    disabled={processing.has(convention.id)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center gap-2"
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
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center gap-2"
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {conventions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune convention</p>
        </div>
      )}
    </div>
  );
};

export default MesConventions;
