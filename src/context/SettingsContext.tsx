
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, CustomTask } from '@/types/models';
import { SettingsContextType } from './types';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Local storage key
const SETTINGS_STORAGE_KEY = 'landscaping-settings';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({});

  // Load settings from localStorage on initial render
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Update settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Add a custom task
  const addCustomTask = (taskName: string): CustomTask => {
    const newTask: CustomTask = {
      id: crypto.randomUUID(),
      name: taskName,
    };

    setSettings((prev) => {
      const customTasks = prev.customTasks || [];
      return {
        ...prev,
        customTasks: [...customTasks, newTask],
      };
    });

    return newTask;
  };

  // Delete a custom task
  const deleteCustomTask = (id: string) => {
    setSettings((prev) => {
      const customTasks = prev.customTasks || [];
      return {
        ...prev,
        customTasks: customTasks.filter((task) => task.id !== id),
      };
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        addCustomTask,
        deleteCustomTask,
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
