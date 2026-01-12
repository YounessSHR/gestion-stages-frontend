import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Footer from './components/Footer';

// Pages d'authentification
import Login from './pages/Login';
import Register from './pages/Register';

// Pages Étudiant
import EtudiantDashboard from './pages/etudiant/Dashboard';
import EtudiantOffres from './pages/etudiant/Offres';
import EtudiantCandidatures from './pages/etudiant/MesCandidatures';
import EtudiantStage from './pages/etudiant/MonStage';
import EtudiantOffreDetails from './pages/etudiant/OffreDetails';
import EtudiantConventions from './pages/etudiant/MesConventions';

// Pages Entreprise
import EntrepriseDashboard from './pages/entreprise/Dashboard';
import EntrepriseOffres from './pages/entreprise/MesOffres';
import EntrepriseCandidatures from './pages/entreprise/Candidatures';
import EntrepriseConventions from './pages/entreprise/MesConventions';
import CreateOffre from './pages/entreprise/CreateOffre';
import EditOffre from './pages/entreprise/EditOffre';

// Pages Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminOffres from './pages/admin/Offres';
import AdminConventions from './pages/admin/Conventions';
import AdminSuivis from './pages/admin/Suivis';

// Pages Tuteur
import TuteurDashboard from './pages/tuteur/Dashboard';
import TuteurEtudiants from './pages/tuteur/MesEtudiants';
import TuteurUpdateSuivi from './pages/tuteur/UpdateSuivi';

// Page Profil
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-linkedin-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Layout>
              <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Route Profil */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['ETUDIANT', 'ENTREPRISE', 'TUTEUR', 'ADMINISTRATION']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            {/* Routes Étudiant */}
            <Route
              path="/etudiant/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ETUDIANT']}>
                  <EtudiantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/etudiant/offres"
              element={
                <ProtectedRoute allowedRoles={['ETUDIANT']}>
                  <EtudiantOffres />
                </ProtectedRoute>
              }
            />
            <Route
              path="/etudiant/candidatures"
              element={
                <ProtectedRoute allowedRoles={['ETUDIANT']}>
                  <EtudiantCandidatures />
                </ProtectedRoute>
              }
            />
            <Route
              path="/etudiant/stage"
              element={
                <ProtectedRoute allowedRoles={['ETUDIANT']}>
                  <EtudiantStage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/etudiant/conventions"
              element={
                <ProtectedRoute allowedRoles={['ETUDIANT']}>
                  <EtudiantConventions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/etudiant/offres/:id"
              element={
                <ProtectedRoute allowedRoles={['ETUDIANT']}>
                  <EtudiantOffreDetails />
                </ProtectedRoute>
              }
            />
            
            {/* Routes Entreprise */}
            <Route
              path="/entreprise/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ENTREPRISE']}>
                  <EntrepriseDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entreprise/offres"
              element={
                <ProtectedRoute allowedRoles={['ENTREPRISE']}>
                  <EntrepriseOffres />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entreprise/offres/nouvelle"
              element={
                <ProtectedRoute allowedRoles={['ENTREPRISE']}>
                  <CreateOffre />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entreprise/offres/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['ENTREPRISE']}>
                  <EditOffre />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entreprise/candidatures"
              element={
                <ProtectedRoute allowedRoles={['ENTREPRISE']}>
                  <EntrepriseCandidatures />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entreprise/conventions"
              element={
                <ProtectedRoute allowedRoles={['ENTREPRISE']}>
                  <EntrepriseConventions />
                </ProtectedRoute>
              }
            />
            
            {/* Routes Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATION']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/offres"
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATION']}>
                  <AdminOffres />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/conventions"
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATION']}>
                  <AdminConventions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/suivis"
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATION']}>
                  <AdminSuivis />
                </ProtectedRoute>
              }
            />
            
            {/* Routes Tuteur */}
            <Route
              path="/tuteur/dashboard"
              element={
                <ProtectedRoute allowedRoles={['TUTEUR']}>
                  <TuteurDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tuteur/etudiants"
              element={
                <ProtectedRoute allowedRoles={['TUTEUR']}>
                  <TuteurEtudiants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tuteur/etudiants/:id"
              element={
                <ProtectedRoute allowedRoles={['TUTEUR']}>
                  <TuteurUpdateSuivi />
                </ProtectedRoute>
              }
            />
            
            {/* Route par défaut */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            </Layout>
          </div>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
