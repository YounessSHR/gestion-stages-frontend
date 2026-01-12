import { useEffect, useState } from 'react';
import { suiviService } from '../../services/suiviService';
import { conventionService } from '../../services/conventionService';
import { toast } from 'react-toastify';

const MonStage = () => {
  const [stage, setStage] = useState(null);
  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stageRes, conventionsRes] = await Promise.all([
        suiviService.getMonStage().catch(() => ({ data: null })),
        conventionService.getByEtudiant().catch(() => ({ data: [] }))
      ]);

      setStage(stageRes.data);
      setConventions(conventionsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSignerConvention = async (id) => {
    if (!window.confirm('Voulez-vous signer cette convention ?')) return;

    setProcessing(prev => new Set(prev).add(id));
    try {
      await conventionService.signerEtudiant(id);
      toast.success('Convention signée !');
      await loadData();
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

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Mon stage</h1>
        <p className="text-sm text-linkedin-gray-600">Suivi de votre stage en cours</p>
      </div>
      
      {stage ? (
        <div className="card-linkedin mb-6">
          <h2 className="text-xl font-semibold mb-4">Suivi du stage</h2>
          <div className="space-y-2">
            <p><strong>État:</strong> {stage.etatAvancement}</p>
            <p><strong>Tuteur:</strong> {stage.tuteurNom}</p>
            {stage.commentaires && (
              <p><strong>Commentaires:</strong> {stage.commentaires}</p>
            )}
            {stage.derniereVisite && (
              <p><strong>Dernière visite:</strong> {new Date(stage.derniereVisite).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="card-linkedin mb-6">
          <p className="text-gray-500">Aucun stage actif</p>
        </div>
      )}

      <div className="card-linkedin">
        <h2 className="text-xl font-semibold mb-4">Mes conventions</h2>
        <div className="space-y-4">
          {conventions.map((convention) => (
            <div key={convention.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{convention.entrepriseNom}</p>
                  <p className="text-sm text-gray-600">Statut: {convention.statut}</p>
                  <p className="text-sm text-gray-600">
                    Signatures: Étudiant {convention.signatureEtudiant ? 'Signé' : 'Non signé'} | 
                    Entreprise {convention.signatureEntreprise ? 'Signé' : 'Non signé'} | 
                    Admin {convention.signatureAdministration ? 'Signé' : 'Non signé'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!convention.signatureEtudiant && (
                    <button
                      onClick={() => handleSignerConvention(convention.id)}
                      disabled={processing.has(convention.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
                        'Télécharger PDF'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {conventions.length === 0 && (
          <p className="text-gray-500">Aucune convention</p>
        )}
      </div>
    </div>
  );
};

export default MonStage;
