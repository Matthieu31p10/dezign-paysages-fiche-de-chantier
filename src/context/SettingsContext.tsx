import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, CustomTask, Personnel } from '@/types/models';
import { SettingsContextType } from './types';
import { toast } from 'sonner';
import { useClientConnections } from '@/hooks/useClientConnections';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({
    companyName: '',
    companyLogo: '',
    loginBackgroundImage: '',
    customTasks: [],
    personnel: [],
    users: [],
    clientConnections: []
  });

  const { clientConnections } = useClientConnections();

  // Load settings from localStorage on mount (except clientConnections)
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Remove client connections from localStorage settings as they're now in Supabase
        const { clientConnections: _, ...settingsWithoutClients } = parsedSettings;
        setSettings(prev => ({ ...prev, ...settingsWithoutClients }));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Update settings with clientConnections from Supabase
  useEffect(() => {
    setSettings(prev => ({ ...prev, clientConnections }));
  }, [clientConnections]);

  // Save settings to localStorage whenever they change (except clientConnections)
  useEffect(() => {
    const { clientConnections: _, ...settingsToSave } = settings;
    localStorage.setItem('appSettings', JSON.stringify(settingsToSave));
  }, [settings]);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    // Don't allow updating clientConnections through this method
    const { clientConnections: _, ...settingsToUpdate } = newSettings;
    setSettings(prev => ({ ...prev, ...settingsToUpdate }));
    toast.success('Paramètres mis à jour');
  };

  const addCustomTask = async (taskName: string): Promise<CustomTask> => {
    const newTask: CustomTask = {
      id: crypto.randomUUID(),
      name: taskName
    };

    setSettings(prev => ({
      ...prev,
      customTasks: [...prev.customTasks, newTask]
    }));

    return newTask;
  };

  const deleteCustomTask = async (id: string) => {
    setSettings(prev => ({
      ...prev,
      customTasks: prev.customTasks.filter(task => task.id !== id)
    }));
  };

  const addPersonnel = async (name: string, position?: string): Promise<Personnel> => {
    const newPersonnel: Personnel = {
      id: crypto.randomUUID(),
      name,
      position: position || '',
      active: true
    };

    setSettings(prev => ({
      ...prev,
      personnel: [...prev.personnel, newPersonnel]
    }));

    return newPersonnel;
  };

  const updatePersonnel = async (personnel: Personnel) => {
    setSettings(prev => ({
      ...prev,
      personnel: prev.personnel.map(p => p.id === personnel.id ? personnel : p)
    }));
  };

  const deletePersonnel = async (id: string) => {
    setSettings(prev => ({
      ...prev,
      personnel: prev.personnel.filter(p => p.id !== id)
    }));
  };

  const togglePersonnelActive = async (id: string, isActive: boolean) => {
    setSettings(prev => ({
      ...prev,
      personnel: prev.personnel.map(p => 
        p.id === id ? { ...p, active: isActive } : p
      )
    }));
  };

  const getPersonnel = (): Personnel[] => {
    return settings.personnel || [];
  };

  const getCustomTasks = (): CustomTask[] => {
    return settings.customTasks || [];
  };

  // Deprecated methods - now handled by useClientConnections hook
  const addClientConnection = async () => {
    console.warn('addClientConnection is deprecated - use useClientConnections hook');
    throw new Error('Use useClientConnections hook instead');
  };

  const updateClientConnection = async () => {
    console.warn('updateClientConnection is deprecated - use useClientConnections hook');
    throw new Error('Use useClientConnections hook instead');
  };

  const deleteClientConnection = async () => {
    console.warn('deleteClientConnection is deprecated - use useClientConnections hook');
    throw new Error('Use useClientConnections hook instead');
  };

  const getClientConnections = () => {
    return settings.clientConnections || [];
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        addCustomTask,
        deleteCustomTask,
        addPersonnel,
        updatePersonnel,
        deletePersonnel,
        getPersonnel,
        togglePersonnelActive,
        getCustomTasks,
        users: settings.users,
        addClientConnection,
        updateClientConnection,
        deleteClientConnection,
        getClientConnections,
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
