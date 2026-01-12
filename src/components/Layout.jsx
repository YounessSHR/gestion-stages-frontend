import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  // LinkedIn-style layout: narrow centered content column
  return (
    <div className="max-w-[1128px] mx-auto px-4">
      <div className="flex gap-6 pt-6">
        {/* Main Content - LinkedIn style narrow column */}
        <div className="flex-1 min-w-0 max-w-[800px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
