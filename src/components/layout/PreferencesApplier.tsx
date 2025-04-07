
import React, { useEffect } from 'react';
import { usePreferences } from '@/context/PreferencesContext';

/**
 * This component doesn't render anything visual but applies user preferences
 * to the document (CSS variables, classes, etc.)
 */
const PreferencesApplier: React.FC = () => {
  const { preferences } = usePreferences();

  useEffect(() => {
    // Apply theme
    if (preferences.theme === 'system') {
      // Check system preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDarkMode);
      
      // Listen for changes to system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Apply theme directly
      document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
    }
  }, [preferences.theme]);
  
  useEffect(() => {
    // Apply layout preferences
    document.body.classList.toggle('compact-mode', preferences.layout.compactMode);
    
    // Add sidebar position class
    document.body.classList.remove('sidebar-left', 'sidebar-right');
    document.body.classList.add(`sidebar-${preferences.layout.sidebarPosition}`);
    
    // Add card style class
    document.body.classList.remove('cards-default', 'cards-minimal', 'cards-bordered');
    document.body.classList.add(`cards-${preferences.layout.cardStyle}`);
    
  }, [preferences.layout]);
  
  // This component doesn't render anything
  return null;
};

export default PreferencesApplier;
