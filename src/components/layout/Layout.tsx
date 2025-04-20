
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useApp } from '@/context/AppContext';

const Layout = () => {
  const { settings } = useApp();
  const companyName = settings.companyName || 'Vertos Chantiers';
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fcf8]">
      <Header />
      <main className="flex-grow px-4 pb-12 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-brand-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© {currentYear} {companyName} - Tous droits réservés</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
