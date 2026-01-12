import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success && result.user) {
      toast.success('Connexion réussie !');
      const userRole = result.user.role;
      switch (userRole) {
        case 'ETUDIANT':
          navigate('/etudiant/dashboard');
          break;
        case 'ENTREPRISE':
          navigate('/entreprise/dashboard');
          break;
        case 'ADMINISTRATION':
          navigate('/admin/dashboard');
          break;
        case 'TUTEUR':
          navigate('/tuteur/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      toast.error(result.message || 'Erreur de connexion');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linkedin-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-black mb-2">LinkUp</h1>
          <p className="text-lg text-linkedin-gray-600">Connectez-vous à votre compte</p>
        </div>

        <div className="card-linkedin">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-linkedin-dark mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-linkedin-dark mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-linkedin-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-primary focus:border-transparent text-linkedin-dark"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-linkedin-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>

            <div className="text-center pt-4 border-t border-linkedin-gray-200">
              <p className="text-sm text-linkedin-gray-600">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-linkedin-primary font-semibold hover:underline">
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
