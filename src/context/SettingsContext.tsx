import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppSettings, CustomTask, Personnel } from '@/types/models';
import { SettingsContextType } from './types';
import { toast } from 'sonner';
import { useClientConnections } from '@/hooks/useClientConnections';
import { useSupabaseSettings } from '@/hooks/useSupabaseSettings';
import { usePersonnelManagement } from '@/hooks/usePersonnelManagement';
import { useUserManagement } from '@/hooks/useUserManagement';

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
  const { 
    settings: supabaseSettings, 
    saveSettings: saveSupabaseSettings,
    updateSetting,
    updateUserPreferences,
    updateAppConfiguration,
    updateNotificationPreferences,
    loading: supabaseLoading 
  } = useSupabaseSettings();
  
  const { 
    personnel: supabasePersonnel,
    addPersonnel: addSupabasePersonnel,
    updatePersonnel: updateSupabasePersonnel,
    deletePersonnel: deleteSupabasePersonnel,
    togglePersonnelActive: toggleSupabasePersonnelActive
  } = usePersonnelManagement();
  
  const { 
    users: supabaseUsers,
    updateUserPermissions: updateSupabaseUserPermissions
  } = useUserManagement();

  // Load settings from localStorage and Supabase
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

  // Sync with Supabase settings
  useEffect(() => {
    if (supabaseSettings && Object.keys(supabaseSettings).length > 0) {
      setSettings(prev => ({
        ...prev,
        companyName: supabaseSettings.company_name || prev.companyName,
        companyLogo: supabaseSettings.company_logo || prev.companyLogo,
        loginBackgroundImage: supabaseSettings.login_background_image || prev.loginBackgroundImage,
        // Add other mappings as needed
      }));
    }
  }, [supabaseSettings]);

  // Update settings with data from Supabase
  useEffect(() => {
    setSettings(prev => {
      const updates: Partial<AppSettings> = {};
      
      // Update clientConnections
      if (JSON.stringify(prev.clientConnections) !== JSON.stringify(clientConnections)) {
        updates.clientConnections = clientConnections;
      }
      
      // Update personnel from Supabase
      if (JSON.stringify(prev.personnel) !== JSON.stringify(supabasePersonnel)) {
        updates.personnel = supabasePersonnel;
      }
      
      // Update users from Supabase
      if (JSON.stringify(prev.users) !== JSON.stringify(supabaseUsers)) {
        updates.users = supabaseUsers;
      }
      
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [clientConnections, supabasePersonnel, supabaseUsers]);

  // Save settings to localStorage whenever they change (except clientConnections)
  useEffect(() => {
    const { clientConnections: _, ...settingsToSave } = settings;
    localStorage.setItem('appSettings', JSON.stringify(settingsToSave));
  }, [settings.companyName, settings.companyLogo, settings.loginBackgroundImage, settings.customTasks, settings.personnel, settings.users]); // Specific dependencies to avoid excessive saves

  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    // Don't allow updating clientConnections through this method
    const { clientConnections: _, ...settingsToUpdate } = newSettings;
    
    // Update local state
    setSettings(prev => ({ ...prev, ...settingsToUpdate }));
    
    // Sync to Supabase
    try {
      const supabaseData: Record<string, unknown> = {};
      if (settingsToUpdate.companyName) supabaseData.company_name = settingsToUpdate.companyName;
      if (settingsToUpdate.companyLogo) supabaseData.company_logo = settingsToUpdate.companyLogo;
      if (settingsToUpdate.loginBackgroundImage) supabaseData.login_background_image = settingsToUpdate.loginBackgroundImage;
      
      if (Object.keys(supabaseData).length > 0) {
        await saveSupabaseSettings(supabaseData);
      }
    } catch (error) {
      console.error('Error syncing settings to Supabase:', error);
      // Keep local state updated even if Supabase sync fails
      toast.success('Paramètres mis à jour localement');
    }
  }, [saveSupabaseSettings]);

  const addCustomTask = useCallback(async (taskName: string): Promise<CustomTask> => {
    const newTask: CustomTask = {
      id: crypto.randomUUID(),
      name: taskName
    };

    setSettings(prev => ({
      ...prev,
      customTasks: [...prev.customTasks, newTask]
    }));

    // Sync to Supabase
    try {
      const appConfig = supabaseSettings.app_configuration as Record<string, unknown> | undefined;
      const currentTasks = (appConfig?.customTasks as Array<{ id: string; name: string }>) || [];
      await updateAppConfiguration({ customTasks: [...currentTasks, newTask] });
    } catch (error) {
      console.error('Error syncing custom task to Supabase:', error);
    }

    return newTask;
  }, [supabaseSettings.app_configuration, updateAppConfiguration]);

  const deleteCustomTask = async (id: string) => {
    setSettings(prev => ({
      ...prev,
      customTasks: prev.customTasks.filter(task => task.id !== id)
    }));

    // Sync to Supabase
    try {
      const appConfig = supabaseSettings.app_configuration as Record<string, unknown> | undefined;
      const currentTasks = (appConfig?.customTasks as Array<{ id: string; name: string }>) || [];
      const updatedTasks = currentTasks.filter((task: { id: string; name: string }) => task.id !== id);
      await updateAppConfiguration({ customTasks: updatedTasks });
    } catch (error) {
      console.error('Error syncing custom task deletion to Supabase:', error);
    }
  };

  // Use Supabase hooks for personnel management
  const addPersonnel = addSupabasePersonnel;
  const updatePersonnel = updateSupabasePersonnel;
  const deletePersonnel = deleteSupabasePersonnel;
  const togglePersonnelActive = toggleSupabasePersonnelActive;

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
        updateUserPermissions: updateSupabaseUserPermissions,
        addClientConnection,
        updateClientConnection,
        deleteClientConnection,
        getClientConnections,
        // Supabase settings methods
        supabaseSettings,
        saveSupabaseSettings,
        updateSetting,
        updateUserPreferences,
        updateAppConfiguration,
        updateNotificationPreferences,
        supabaseLoading,
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
