
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings } from '@/types/models';
import { SettingsContextType } from './types';
import { toast } from 'sonner';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Local storage key
const SETTINGS_STORAGE_KEY = 'landscaping-settings';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({});

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        if (!parsedSettings.personnel) {
          parsedSettings.personnel = [];
        }
        setSettings(parsedSettings);
      } else {
        setSettings({ 
          personnel: [] 
        });
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      toast.error('Erreur lors du chargement des paramètres');
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    toast.success('Paramètres mis à jour');
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
