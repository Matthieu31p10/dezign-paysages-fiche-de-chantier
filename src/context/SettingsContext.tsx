
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, CustomTask, Personnel, User } from '@/types/models';
import { SettingsContextType } from './types';
import { toast } from 'sonner';

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

  // Personnel methods
  const addPersonnel = (name: string, position?: string) => {
    const newPerson: Personnel = {
      id: crypto.randomUUID(),
      name,
      position,
      active: true,
    };

    setSettings((prev) => {
      const personnel = prev.personnel || [];
      return {
        ...prev,
        personnel: [...personnel, newPerson],
      };
    });
  };

  const updatePersonnel = (id: string, name: string, position?: string) => {
    setSettings((prev) => {
      const personnel = prev.personnel || [];
      return {
        ...prev,
        personnel: personnel.map((person) =>
          person.id === id ? { ...person, name, position } : person
        ),
      };
    });
  };

  const togglePersonnelActive = (id: string) => {
    setSettings((prev) => {
      const personnel = prev.personnel || [];
      return {
        ...prev,
        personnel: personnel.map((person) =>
          person.id === id ? { ...person, active: !person.active } : person
        ),
      };
    });
  };

  const deletePersonnel = (id: string) => {
    setSettings((prev) => {
      const personnel = prev.personnel || [];
      return {
        ...prev,
        personnel: personnel.filter((person) => person.id !== id),
      };
    });
  };

  // Helper methods to get data
  const getPersonnel = () => {
    return settings.personnel || [];
  };

  const getCustomTasks = () => {
    return settings.customTasks || [];
  };

  // User methods
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const users = settings.users || [];
    if (users.some((u) => u.username.toLowerCase() === userData.username.toLowerCase())) {
      toast.error('Ce nom d\'utilisateur existe déjà');
      return;
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    setSettings((prev) => ({
      ...prev,
      users: [...(prev.users || []), newUser],
    }));
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setSettings((prev) => {
      const users = prev.users || [];
      return {
        ...prev,
        users: users.map((user) =>
          user.id === id ? { ...user, ...userData } : user
        ),
      };
    });
  };

  const deleteUser = (id: string) => {
    setSettings((prev) => {
      const users = prev.users || [];
      return {
        ...prev,
        users: users.filter((user) => user.id !== id),
      };
    });
  };

  // Custom tasks methods
  const addCustomTask = (taskName: string) => {
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

  const updateCustomTask = (id: string, name: string) => {
    setSettings((prev) => {
      const customTasks = prev.customTasks || [];
      return {
        ...prev,
        customTasks: customTasks.map((task) =>
          task.id === id ? { ...task, name } : task
        ),
      };
    });
  };

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
        addPersonnel,
        updatePersonnel,
        togglePersonnelActive,
        deletePersonnel,
        addUser,
        updateUser,
        deleteUser,
        addCustomTask,
        updateCustomTask,
        deleteCustomTask,
        getCustomTasks,
        getPersonnel,
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
