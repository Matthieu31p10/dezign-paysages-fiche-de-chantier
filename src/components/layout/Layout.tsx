
import { ReactNode, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { useApp } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout = () => {
  const { settings } = useApp();
  const isMobile = useIsMobile();
  const location = useLocation();
  const companyName = settings.companyName || 'Vertos Chantiers';
  const currentYear = new Date().getFullYear();
  
  // Mémorisation du style de background basé sur le path
  const backgroundStyle = useMemo(() => {
    if (location.pathname.startsWith('/blank-worksheets')) {
      return 'bg-gradient-to-br from-slate-50 to-slate-100';
    } else if (location.pathname.startsWith('/worklogs')) {
      return 'bg-gradient-to-br from-green-50 to-green-100/50';
    } else if (location.pathname.startsWith('/schedule')) {
      return 'bg-gradient-to-br from-blue-50 to-green-50';
    }
    return 'bg-gradient-to-br from-green-50 to-blue-50/30';
  }, [location.pathname]);

  // Mémorisation des liens du footer
  const footerLinks = useMemo(() => [
    { href: "#", label: "Mentions légales" },
    { href: "#", label: "Politique de confidentialité" },
    { href: "#", label: "Contact" },
    { href: "#", label: "Support" }
  ], []);

  return (
    <div className={`min-h-screen flex flex-col ${backgroundStyle} transition-all duration-500`}>
      <Header />
      <main className={`flex-grow ${isMobile ? 'px-3 pb-6 pt-6' : 'px-6 pb-12 pt-8 sm:px-8 lg:px-12'} max-w-7xl mx-auto w-full transition-all duration-300`}>
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <footer className={`py-4 ${isMobile ? 'px-3' : 'py-6 px-6 sm:px-8 lg:px-12'} border-t border-green-200 bg-white/80 backdrop-blur-sm shadow-sm`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="font-medium">© {currentYear} {companyName} - Tous droits réservés</p>
          </div>
          <div className="flex gap-6">
            {footerLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="hover:text-green-600 transition-all duration-200 hover:scale-105 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
