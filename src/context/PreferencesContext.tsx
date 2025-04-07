
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences, defaultPreferences } from '@/types/preferences';

// Define the shape of our context
interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

// Create the context
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Local storage key
const PREFERENCES_STORAGE_KEY = 'landscaping-preferences';

// Context provider component
export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with default preferences
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (storedPreferences) {
        const parsedPrefs = JSON.parse(storedPreferences);
        setPreferences(parsedPrefs);
      }
    } catch (error) {
      console.error('Error loading preferences from localStorage:', error);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // Update preferences
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences,
      // Handle nested updates for colors and layout
      ...(newPreferences.colors && { colors: { ...prev.colors, ...newPreferences.colors } }),
      ...(newPreferences.layout && { layout: { ...prev.layout, ...newPreferences.layout } }),
    }));
  };

  // Reset preferences to default
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook for using the preferences context
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
