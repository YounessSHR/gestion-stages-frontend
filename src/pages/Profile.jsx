import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { cvService } from '../services/cvService';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ETUDIANT': return '/etudiant/dashboard';
      case 'ENTREPRISE': return '/entreprise/dashboard';
      case 'ADMINISTRATION': return '/admin/dashboard';
      case 'TUTEUR': return '/tuteur/dashboard';
      default: return '/';
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userService.getMyProfile();
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateMyProfile(formData);
      setProfile(response.data);
      setEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await userService.changePassword({
        ancienMotDePasse: passwordData.currentPassword,
        nouveauMotDePasse: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setChangingPassword(false);
      toast.success('Mot de passe modifié avec succès');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.defaultMessage || 'Erreur lors du changement de mot de passe';
      toast.error(errorMessage);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format de fichier non autorisé. Formats acceptés: PDF, DOC, DOCX');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux. Taille maximale: 5MB');
      return;
    }

    setUploadingCV(true);
    setCvFile(file);

    try {
      await cvService.uploadCV(file);
      toast.success('CV uploadé avec succès');
      await loadProfile(); // Reload profile to get updated CV info
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload du CV');
    } finally {
      setUploadingCV(false);
      setCvFile(null);
      e.target.value = ''; // Reset file input
    }
  };

  const handleCVDownload = async () => {
    try {
      const response = await cvService.downloadMyCV();
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV_${profile.nom}_${profile.prenom}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CV téléchargé avec succès');
    } catch (error) {
      toast.error('Erreur lors du téléchargement du CV');
    }
  };

  const handleCVDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')) return;

    try {
      await cvService.deleteCV();
      toast.success('CV supprimé avec succès');
      await loadProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression du CV');
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (!profile) return <div className="p-4">Erreur lors du chargement du profil</div>;

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-linkedin-dark mb-1">Mon profil</h1>
        <p className="text-sm text-linkedin-gray-600">Gérez vos informations personnelles</p>
      </div>

      {/* Informations générales */}
      <div className="card-linkedin mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Informations personnelles</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
            >
              Modifier
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: +33 6 12 34 56 78"
                />
              </div>

              {/* Champs spécifiques Étudiant */}
              {user?.role === 'ETUDIANT' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Niveau</label>
                    <input
                      type="text"
                      name="niveau"
                      value={formData.niveau || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Filière</label>
                    <input
                      type="text"
                      name="filiere"
                      value={formData.filiere || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de naissance</label>
                    <input
                      type="date"
                      name="dateNaissance"
                      value={formData.dateNaissance || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </>
              )}

              {/* Champs spécifiques Entreprise */}
              {user?.role === 'ENTREPRISE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom de l'entreprise</label>
                    <input
                      type="text"
                      name="nomEntreprise"
                      value={formData.nomEntreprise || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Secteur d'activité</label>
                    <input
                      type="text"
                      name="secteurActivite"
                      value={formData.secteurActivite || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Adresse</label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site web</label>
                    <input
                      type="url"
                      name="siteWeb"
                      value={formData.siteWeb || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </>
              )}

              {/* Champs spécifiques Tuteur */}
              {user?.role === 'TUTEUR' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Département</label>
                    <input
                      type="text"
                      name="departement"
                      value={formData.departement || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Spécialité</label>
                    <input
                      type="text"
                      name="specialite"
                      value={formData.specialite || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium text-gray-800">{profile.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prénom</p>
                <p className="font-medium text-gray-800">{profile.prenom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{profile.email}</p>
              </div>
              {profile.telephone && (
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium text-gray-800">{profile.telephone}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {user?.role === 'ETUDIANT' && (
                <>
                  {profile.niveau && (
                    <div>
                      <p className="text-sm text-gray-500">Niveau</p>
                      <p className="font-medium text-gray-800">{profile.niveau}</p>
                    </div>
                  )}
                  {profile.filiere && (
                    <div>
                      <p className="text-sm text-gray-500">Filière</p>
                      <p className="font-medium text-gray-800">{profile.filiere}</p>
                    </div>
                  )}
                  {profile.dateNaissance && (
                    <div>
                      <p className="text-sm text-gray-500">Date de naissance</p>
                      <p className="font-medium text-gray-800">{profile.dateNaissance}</p>
                    </div>
                  )}
                </>
              )}

              {user?.role === 'ENTREPRISE' && (
                <>
                  {profile.nomEntreprise && (
                    <div>
                      <p className="text-sm text-gray-500">Entreprise</p>
                      <p className="font-medium text-gray-800">{profile.nomEntreprise}</p>
                    </div>
                  )}
                  {profile.secteurActivite && (
                    <div>
                      <p className="text-sm text-gray-500">Secteur d'activité</p>
                      <p className="font-medium text-gray-800">{profile.secteurActivite}</p>
                    </div>
                  )}
                  {profile.adresse && (
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium text-gray-800">{profile.adresse}</p>
                    </div>
                  )}
                  {profile.siteWeb && (
                    <div>
                      <p className="text-sm text-gray-500">Site web</p>
                      <a href={profile.siteWeb} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">{profile.siteWeb}</a>
                    </div>
                  )}
                  {profile.description && (
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="font-medium text-gray-800">{profile.description}</p>
                    </div>
                  )}
                </>
              )}

              {user?.role === 'TUTEUR' && (
                <>
                  {profile.departement && (
                    <div>
                      <p className="text-sm text-gray-500">Département</p>
                      <p className="font-medium text-gray-800">{profile.departement}</p>
                    </div>
                  )}
                  {profile.specialite && (
                    <div>
                      <p className="text-sm text-gray-500">Spécialité</p>
                      <p className="font-medium text-gray-800">{profile.specialite}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gestion du CV (Étudiant uniquement) */}
      {user?.role === 'ETUDIANT' && (
        <div className="card-linkedin">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mon CV</h2>
          
          {profile.cv ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-green-800">CV téléchargé</p>
                  <p className="text-sm text-green-600">Votre CV est disponible pour les entreprises</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCVDownload}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger mon CV
                </button>
                
                <label className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploadingCV ? 'Upload en cours...' : 'Remplacer le CV'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCVUpload}
                    disabled={uploadingCV}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={handleCVDelete}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">Aucun CV téléchargé</p>
                <p className="text-sm text-yellow-600 mt-1">Téléchargez votre CV pour que les entreprises puissent le consulter</p>
              </div>
              
              <label className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm cursor-pointer w-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {uploadingCV ? 'Upload en cours...' : 'Télécharger mon CV'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCVUpload}
                  disabled={uploadingCV}
                  className="hidden"
                />
              </label>
              
              <p className="text-xs text-gray-500 text-center">
                Formats acceptés: PDF, DOC, DOCX (max 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Changement de mot de passe */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Changement de mot de passe</h2>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
            >
              Changer le mot de passe
            </button>
          )}
        </div>

        {changingPassword && (
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Mot de passe actuel *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Entrez votre mot de passe actuel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Nouveau mot de passe *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minLength={8}
                  placeholder="Minimum 8 caractères"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères requis</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Confirmer le nouveau mot de passe *</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    passwordData.newPassword && passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword
                      ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  minLength={8}
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                {passwordData.newPassword && passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword && (
                  <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={passwordData.newPassword !== passwordData.confirmNewPassword || passwordData.newPassword.length < 8}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangingPassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
