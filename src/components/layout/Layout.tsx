
import { Outlet } from 'react-router-dom';
import Header from './Header';
import PreferencesApplier from './PreferencesApplier';
import { usePreferences } from '@/context/PreferencesContext';

const Layout = () => {
  const { preferences } = usePreferences();
  
  // Apply classes based on user preferences
  const getLayoutClasses = () => {
    const classes = ['min-h-screen', 'flex', 'flex-col'];
    
    // Add background color class based on theme
    classes.push(preferences.theme === 'dark' ? 'bg-[#1a1f1a]' : 'bg-[#f8fcf8]');
    
    // Add compact mode if enabled
    if (preferences.layout.compactMode) {
      classes.push('compact-layout');
    }
    
    return classes.join(' ');
  };

  return (
    <div className={getLayoutClasses()}>
      <PreferencesApplier />
      <Header />
      <main className={`flex-grow px-4 pb-12 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full ${
        preferences.layout.compactMode ? 'space-y-2' : 'space-y-6'
      }`}>
        <Outlet />
      </main>
      <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-brand-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Vertos Chantiers - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
