
import { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import AppBreadcrumbs from '../common/AppBreadcrumbs';
import { useApp } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { SkipLink } from '../accessibility/AccessibilityComponents';

const Layout = () => {
  const { settings } = useApp();
  const isMobile = useIsMobile();
  const location = useLocation();
  const companyName = settings.companyName || 'Vertos Chantiers';
  const currentYear = new Date().getFullYear();
  
  // Enhanced background styles based on path with more vibrant colors
  const getBackgroundStyle = () => {
    if (location.pathname.startsWith('/blank-worksheets')) {
      return 'bg-gradient-to-br from-slate-100 via-slate-50 to-white';
    } else if (location.pathname.startsWith('/worklogs')) {
      return 'bg-gradient-to-br from-green-100 via-green-50 to-white';
    } else if (location.pathname.startsWith('/schedule')) {
      return 'bg-gradient-to-br from-blue-100 via-blue-50 to-white';
    } else if (location.pathname.startsWith('/projects')) {
      return 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-white';
    }
    return 'bg-gradient-to-br from-gray-100 via-white to-gray-50';
  };

  return (
    <div className={`min-h-screen flex flex-col ${getBackgroundStyle()}`}>
      <SkipLink targetId="main-content">Aller au contenu principal</SkipLink>
      <Header />
      <AppBreadcrumbs />
      <main 
        id="main-content"
        role="main"
        tabIndex={-1}
        className={`flex-grow ${
          isMobile ? 'px-3 pb-6 pt-6' : 'px-4 pb-12 pt-8 sm:px-6 lg:px-8'
        } max-w-7xl mx-auto w-full transition-all duration-300`}
        aria-label="Contenu principal de l'application"
      >
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <footer 
        className={`${
          isMobile ? 'px-3 py-4' : 'py-6 px-4 sm:px-6 lg:px-8'
        } border-t border-border/60 bg-background/85 backdrop-blur-sm transition-all duration-300`}
        role="contentinfo"
        aria-label="Informations sur l'entreprise et liens légaux"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-600">
          <p className="font-medium">© {currentYear} {companyName} - Tous droits réservés</p>
          <div className="flex gap-6">
            <a 
              href="#" 
              className="hover:text-green-700 transition-colors duration-200 hover:underline"
              aria-label="Consulter les mentions légales"
            >
              Mentions légales
            </a>
            <a 
              href="#" 
              className="hover:text-green-700 transition-colors duration-200 hover:underline"
              aria-label="Nous contacter"
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
