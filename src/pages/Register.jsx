import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: 'ETUDIANT',
    // Champs spécifiques
    niveau: '',
    filiere: '',
    dateNaissance: '',
    nomEntreprise: '',
    secteurActivite: '',
    adresse: '',
    siteWeb: '',
    description: '',
    departement: '',
    specialite: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } else {
      toast.error(result.message || 'Erreur lors de l\'inscription');
    }
    
    setLoading(false);
  };

  const showEtudiantFields = formData.role === 'ETUDIANT';
  const showEntrepriseFields = formData.role === 'ENTREPRISE';
  const showTuteurFields = formData.role === 'TUTEUR';

  return (
    <div className="min-h-screen bg-linkedin-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-black mb-2">LinkUp</h1>
          <h2 className="text-2xl font-semibold text-linkedin-dark mb-2">Inscription</h2>
          <p className="text-lg text-linkedin-gray-600">Créez votre compte</p>
        </div>
        
        <form onSubmit={handleSubmit} className="card-linkedin space-y-6">
          {/* Champs communs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-linkedin-dark text-sm font-semibold mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
              />
            </div>
            <div>
              <label className="block text-linkedin-dark text-sm font-semibold mb-2">Mot de passe *</label>
              <input
                type="password"
                name="motDePasse"
                required
                minLength={8}
                value={formData.motDePasse}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-linkedin-dark text-sm font-semibold mb-2">Nom *</label>
              <input
                type="text"
                name="nom"
                required
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
              />
            </div>
            <div>
              <label className="block text-linkedin-dark text-sm font-semibold mb-2">Prénom *</label>
              <input
                type="text"
                name="prenom"
                required
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-linkedin-dark text-sm font-semibold mb-2">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
            />
          </div>

          <div>
            <label className="block text-linkedin-dark text-sm font-semibold mb-2">Rôle *</label>
            <select
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark bg-white"
            >
              <option value="ETUDIANT">Étudiant</option>
              <option value="ENTREPRISE">Entreprise</option>
              <option value="TUTEUR">Tuteur</option>
              <option value="ADMINISTRATION">Administration</option>
            </select>
          </div>

          {/* Champs Étudiant */}
          {showEtudiantFields && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-linkedin-dark text-sm font-semibold mb-2">Niveau</label>
                  <input
                    type="text"
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                  />
                </div>
                <div>
                  <label className="block text-linkedin-dark text-sm font-semibold mb-2">Filière</label>
                  <input
                    type="text"
                    name="filiere"
                    value={formData.filiere}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                  />
                </div>
              </div>
              <div>
                <label className="block text-linkedin-dark text-sm font-semibold mb-2">Date de naissance</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                />
              </div>
            </>
          )}

          {/* Champs Entreprise */}
          {showEntrepriseFields && (
            <>
              <div>
                <label className="block text-linkedin-dark text-sm font-semibold mb-2">Nom de l'entreprise *</label>
                <input
                  type="text"
                  name="nomEntreprise"
                  required
                  value={formData.nomEntreprise}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                />
              </div>
              <div>
                <label className="block text-linkedin-dark text-sm font-semibold mb-2">Secteur d'activité</label>
                <input
                  type="text"
                  name="secteurActivite"
                  value={formData.secteurActivite}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                />
              </div>
              <div>
                <label className="block text-linkedin-dark text-sm font-semibold mb-2">Adresse</label>
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                />
              </div>
              <div>
                <label className="block text-linkedin-dark text-sm font-semibold mb-2">Site web</label>
                <input
                  type="url"
                  name="siteWeb"
                  value={formData.siteWeb}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                />
              </div>
              <div>
                <label className="block text-linkedin-dark text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                />
              </div>
            </>
          )}

          {/* Champs Tuteur */}
          {showTuteurFields && (
            <>
              <div>
                <label className="block text-linkedin-dark text-sm font-semibold mb-2">Département</label>
                <input
                  type="text"
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                />
              </div>
              <div>
                <label className="block text-linkedin-dark text-sm font-semibold mb-2">Spécialité</label>
                <input
                  type="text"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-linkedin-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-linkedin-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inscription...
                </span>
              ) : (
                'S\'inscrire'
              )}
            </button>
            <Link to="/login" className="text-sm font-semibold text-linkedin-primary hover:underline">
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
