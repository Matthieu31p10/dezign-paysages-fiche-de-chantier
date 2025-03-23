
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { AppProvider } from '@/context/AppContext';

const Layout = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#f8fcf8]">
        <Header />
        <main className="flex-grow px-4 pb-12 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
        <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-brand-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Vertos Chantiers - Tous droits réservés</p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default Layout;
