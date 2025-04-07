
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, defaultPreferences } from '@/types/preferences';
import { useAuth } from './AuthContext';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  updateThemeColors: (colors: Partial<UserPreferences['colors']>) => void;
  updateLayoutPreferences: (layout: Partial<UserPreferences['layout']>) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Local storage key with user ID to have per-user preferences
const getPreferencesKey = (userId: string) => `landscaping-preferences-${userId}`;

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on initial render and when user changes
  useEffect(() => {
    if (auth.currentUser) {
      try {
        const storageKey = getPreferencesKey(auth.currentUser.id);
        const storedPreferences = localStorage.getItem(storageKey);
        
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        } else {
          // If no preferences found for this user, set defaults
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error('Error loading preferences from localStorage:', error);
        setPreferences(defaultPreferences);
      }
    } else {
      // Reset to default if no user
      setPreferences(defaultPreferences);
    }
  }, [auth.currentUser]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (auth.currentUser) {
      const storageKey = getPreferencesKey(auth.currentUser.id);
      localStorage.setItem(storageKey, JSON.stringify(preferences));
      
      // Apply theme to document
      document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
      
      // Apply custom colors as CSS variables
      document.documentElement.style.setProperty('--primary', preferences.colors.primary);
      document.documentElement.style.setProperty('--secondary', preferences.colors.secondary);
      document.documentElement.style.setProperty('--accent', preferences.colors.accent);
      document.documentElement.style.setProperty('--background', preferences.colors.background);
      
      // Apply font size based on preference
      const bodyClasses = document.body.classList;
      bodyClasses.remove('text-sm', 'text-base', 'text-lg');
      switch (preferences.layout.fontSize) {
        case 'small':
          bodyClasses.add('text-sm');
          break;
        case 'medium':
          bodyClasses.add('text-base');
          break;
        case 'large':
          bodyClasses.add('text-lg');
          break;
      }
    }
  }, [preferences, auth.currentUser]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const updateThemeColors = (colors: Partial<UserPreferences['colors']>) => {
    setPreferences(prev => ({
      ...prev,
      colors: { ...prev.colors, ...colors }
    }));
  };

  const updateLayoutPreferences = (layout: Partial<UserPreferences['layout']>) => {
    setPreferences(prev => ({
      ...prev,
      layout: { ...prev.layout, ...layout }
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        updateThemeColors,
        updateLayoutPreferences,
        resetPreferences
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
