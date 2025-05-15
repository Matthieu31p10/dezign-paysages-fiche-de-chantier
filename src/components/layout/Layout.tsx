
import { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { useApp } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from 'sonner';

const Layout = () => {
  const { settings } = useApp();
  const isMobile = useIsMobile();
  const location = useLocation();
  const companyName = settings.companyName || 'Vertos Chantiers';
  const currentYear = new Date().getFullYear();
  
  // Ajoute différents styles de fond basés sur le chemin
  const getBackgroundStyle = () => {
    if (location.pathname.startsWith('/blank-worksheets')) {
      return 'bg-slate-50'; // Fond bleu clair pour les fiches vierges
    } else if (location.pathname.startsWith('/worklogs')) {
      return 'bg-[#f8fcf8]'; // Fond vert clair pour les fiches de suivi
    }
    return 'bg-[#f8fcf8]'; // Fond par défaut
  };
  
  // Vérification de la connexion à Supabase dans le composant de layout
  // Cela permettra de détecter les problèmes de connexion rapidement
  return (
    <div className={`min-h-screen flex flex-col ${getBackgroundStyle()} transition-colors duration-300`}>
      <Header />
      <main className={`flex-grow ${isMobile ? 'px-2 pb-6 pt-4' : 'px-4 pb-12 pt-6 sm:px-6 lg:px-8'} max-w-7xl mx-auto w-full`}>
        <div className="page-transition">
          <Outlet />
        </div>
      </main>
      <footer className={`py-3 ${isMobile ? 'px-2' : 'py-4 px-4 sm:px-6 lg:px-8'} border-t border-brand-100 bg-white/50 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© {currentYear} {companyName} - Tous droits réservés</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
      {/* Ajouter un deuxième Toaster pour garantir que les notifications sont visibles partout */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default Layout;
