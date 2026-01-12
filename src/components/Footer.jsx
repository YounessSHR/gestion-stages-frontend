import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-linkedin-gray-200 mt-auto">
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm text-black">
            © {currentYear} <span className="font-black">LinkUp</span>. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
