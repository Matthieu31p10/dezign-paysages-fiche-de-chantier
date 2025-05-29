
import { ReactNode } from 'react';
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
  
  // Enhanced background styles based on path
  const getBackgroundStyle = () => {
    if (location.pathname.startsWith('/blank-worksheets')) {
      return 'bg-gradient-to-br from-slate-50 via-slate-25 to-white';
    } else if (location.pathname.startsWith('/worklogs')) {
      return 'bg-gradient-to-br from-green-50 via-green-25 to-white';
    } else if (location.pathname.startsWith('/schedule')) {
      return 'bg-gradient-to-br from-blue-50 via-blue-25 to-white';
    } else if (location.pathname.startsWith('/projects')) {
      return 'bg-gradient-to-br from-emerald-50 via-emerald-25 to-white';
    }
    return 'bg-gradient-to-br from-gray-50 via-white to-gray-25';
  };

  return (
    <div className={`min-h-screen flex flex-col ${getBackgroundStyle()}`}>
      <Header />
      <main className={`flex-grow ${
        isMobile ? 'px-3 pb-6 pt-6' : 'px-4 pb-12 pt-8 sm:px-6 lg:px-8'
      } max-w-7xl mx-auto w-full transition-all duration-300`}>
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <footer className={`${
        isMobile ? 'px-3 py-4' : 'py-6 px-4 sm:px-6 lg:px-8'
      } border-t border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p className="font-medium">© {currentYear} {companyName} - Tous droits réservés</p>
          <div className="flex gap-6">
            <a 
              href="#" 
              className="hover:text-green-600 transition-colors duration-200 hover:underline"
            >
              Mentions légales
            </a>
            <a 
              href="#" 
              className="hover:text-green-600 transition-colors duration-200 hover:underline"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
