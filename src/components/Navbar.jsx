import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(() => {
        loadUnreadCount();
        if (showNotifications) {
          loadNotifications();
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, showNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getAll();
      setNotifications(response.data || []);
    } catch (error) {
      // Silent fail
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getCount();
      setUnreadCount(response.data || 0);
    } catch (error) {
      // Silent fail
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.marquerCommeLu(id);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.marquerToutesCommeLues();
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.lu) {
      handleMarkAsRead(notification.id);
    }
    setShowNotifications(false);
    if (notification.lienAction) {
      navigate(notification.lienAction);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (isAuthPage) {
    return null;
  }

  // Navigation items based on role
  const getNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'ETUDIANT':
        return [
          { path: '/etudiant/dashboard', label: 'Accueil', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { path: '/etudiant/offres', label: 'Offres', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { path: '/etudiant/candidatures', label: 'Candidatures', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { path: '/etudiant/conventions', label: 'Conventions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { path: '/etudiant/stage', label: 'Mon Stage', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        ];
      case 'ENTREPRISE':
        return [
          { path: '/entreprise/dashboard', label: 'Accueil', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { path: '/entreprise/offres', label: 'Mes Offres', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { path: '/entreprise/candidatures', label: 'Candidatures', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { path: '/entreprise/conventions', label: 'Conventions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        ];
      case 'ADMINISTRATION':
        return [
          { path: '/admin/dashboard', label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { path: '/admin/offres', label: 'Validation Offres', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { path: '/admin/conventions', label: 'Conventions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { path: '/admin/suivis', label: 'Suivis', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        ];
      case 'TUTEUR':
        return [
          { path: '/tuteur/dashboard', label: 'Accueil', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { path: '/tuteur/etudiants', label: 'Mes Étudiants', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white border-b border-linkedin-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1128px] mx-auto px-4">
        <div className="relative flex items-center justify-between h-14">
          {/* Logo */}
          <Link to={user ? getDashboardPath() : '/'} className="flex items-center flex-shrink-0 z-10">
            <span className="text-xl font-black text-black">LinkUp</span>
          </Link>
          
          {user ? (
            <>
              {/* Navigation Links - Centered */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                {getNavItems().map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'text-linkedin-primary'
                        : 'text-linkedin-gray-600 hover:text-linkedin-dark'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="text-xs font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-linkedin-primary rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>

              {/* Right Section - Notifications, Profile & Logout */}
              <div className="flex items-center gap-3 flex-shrink-0 z-10 ml-auto">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-md hover:bg-linkedin-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6 text-linkedin-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-linkedin-gray-200 max-h-96 overflow-hidden flex flex-col z-50">
                      <div className="p-4 border-b border-linkedin-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-linkedin-dark">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-linkedin-primary hover:underline"
                          >
                            Tout marquer comme lu
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-linkedin-gray-500">
                            <p>Aucune notification</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 border-b border-linkedin-gray-100 cursor-pointer hover:bg-linkedin-gray-50 transition-colors ${
                                !notification.lu ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  !notification.lu ? 'bg-linkedin-primary' : 'bg-transparent'
                                }`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-linkedin-dark">{notification.message}</p>
                                  <p className="text-xs text-linkedin-gray-500 mt-1">
                                    {new Date(notification.dateCreation).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-linkedin-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-linkedin-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.prenom?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-semibold text-linkedin-dark">{user.prenom} {user.nom}</span>
                    <span className="text-xs text-linkedin-gray-600">{user.role}</span>
                  </div>
                </Link>
              </div>
              
              {/* Logout Button - Far Right */}
              <div className="flex-shrink-0 z-10">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-linkedin-gray-600 hover:text-linkedin-dark rounded-md hover:bg-linkedin-gray-100 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-4 py-1.5 text-sm font-semibold text-linkedin-primary hover:bg-linkedin-gray-100 rounded-full transition-colors"
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                className="btn-linkedin-primary"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
