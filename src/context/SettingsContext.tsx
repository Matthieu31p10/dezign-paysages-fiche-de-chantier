import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, CustomTask, Personnel, ClientConnection } from '@/types/models';
import { SettingsContextType } from './types';
import { toast } from 'sonner';

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

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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

  const addClientConnection = async (clientData: Omit<ClientConnection, 'id' | 'createdAt'>): Promise<ClientConnection> => {
    const newClient: ClientConnection = {
      ...clientData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    setSettings(prev => ({
      ...prev,
      clientConnections: [...(prev.clientConnections || []), newClient]
    }));

    return newClient;
  };

  const updateClientConnection = async (client: ClientConnection) => {
    setSettings(prev => ({
      ...prev,
      clientConnections: (prev.clientConnections || []).map(c => 
        c.id === client.id ? client : c
      )
    }));
  };

  const deleteClientConnection = async (id: string) => {
    setSettings(prev => ({
      ...prev,
      clientConnections: (prev.clientConnections || []).filter(c => c.id !== id)
    }));
  };

  const getClientConnections = (): ClientConnection[] => {
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
