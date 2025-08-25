
import { Outlet, useLocation } from 'react-router-dom';
import AppBreadcrumbs from '../common/AppBreadcrumbs';
import Header from './Header';
import { useApp } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { SkipLink } from '../accessibility/AccessibilityComponents';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';
import MobileOptimizedView from '@/components/pwa/MobileOptimizedView';
import { usePWA } from '@/hooks/usePWA';
import { useState, useEffect } from 'react';

const Layout = () => {
  const { settings } = useApp();
  const isMobile = useIsMobile();
  const location = useLocation();
  const companyName = settings.companyName || 'Vertos Chantiers';
  const currentYear = new Date().getFullYear();
  const { isInstallable, isInstalled } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Show install prompt after 30 seconds if app is installable but not installed
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled) {
        setShowInstallPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled]);
  
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
    <MobileOptimizedView className="min-h-screen flex flex-col w-full">
      <SkipLink targetId="main-content">Aller au contenu principal</SkipLink>
      
      <Header />
      
      <div className={`flex-1 ${getBackgroundStyle()}`}>
        <div className={`flex ${isMobile ? 'h-12' : 'h-14'} shrink-0 items-center gap-2 border-b ${isMobile ? 'px-3' : 'px-4'}`}>
          <div className="flex-1 min-w-0">
            <AppBreadcrumbs />
          </div>
        </div>
        
        <main 
          id="main-content"
          role="main"
          tabIndex={-1}
          className={`flex-1 overflow-auto ${
            isMobile 
              ? 'px-3 pb-safe-6 pt-4' 
              : 'px-4 pb-12 pt-8 sm:px-6 lg:px-8'
          } transition-all duration-300`}
          aria-label="Contenu principal de l'application"
        >
          <div className="animate-fade-in max-w-full">
            <Outlet />
          </div>
        </main>
        
        <footer 
          className={`${
            isMobile 
              ? 'px-3 py-3 pb-safe text-center' 
              : 'py-6 px-4 sm:px-6 lg:px-8'
          } border-t border-border/60 bg-background/95 backdrop-blur-sm transition-all duration-300`}
          role="contentinfo"
          aria-label="Informations sur l'entreprise et liens légaux"
        >
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row'} justify-between items-center gap-2 text-sm text-muted-foreground`}>
            <p className="font-medium">© {currentYear} {companyName}</p>
            <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-6'}`}>
              <a 
                href="#" 
                className="hover:text-primary transition-colors duration-200 hover:underline touch-target"
                aria-label="Consulter les mentions légales"
              >
                Mentions légales
              </a>
              <a 
                href="#" 
                className="hover:text-primary transition-colors duration-200 hover:underline touch-target"
                aria-label="Nous contacter"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
      
      {/* PWA Components */}
      <OfflineIndicator />
      {showInstallPrompt && (
        <InstallPrompt onDismiss={() => setShowInstallPrompt(false)} />
      )}
    </MobileOptimizedView>
  );
};

export default Layout;
