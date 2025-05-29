
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
  
  // Mémorisation des liens du footer
  const footerLinks = useMemo(() => [
    { href: "#", label: "Mentions légales" },
    { href: "#", label: "Politique de confidentialité" },
    { href: "#", label: "Contact" },
    { href: "#", label: "Support" }
  ], []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className={`flex-grow ${isMobile ? 'px-4 py-6' : 'px-6 py-8 sm:px-8 lg:px-12'} max-w-7xl mx-auto w-full`}>
        <Outlet />
      </main>
      <footer className={`py-4 ${isMobile ? 'px-4' : 'py-6 px-6 sm:px-8 lg:px-12'} border-t border-gray-200 bg-white`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <p>© {currentYear} {companyName} - Tous droits réservés</p>
          </div>
          <div className="flex gap-6">
            {footerLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
