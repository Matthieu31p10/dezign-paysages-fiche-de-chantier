
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Team, AppSettings } from '@/types/models';
import { useSettings } from './SettingsContext';

interface AppContextType {
  currentUser: User | null;
  teams: Team[];
  settings: AppSettings;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  canUserAccess: (requiredRole: UserRole | string) => boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  addTeam: (name: string) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultAdmin: User = {
  id: 'admin-default',
  username: 'admin',
  password: 'admin',
  role: 'admin',
  name: 'Administrateur',
  createdAt: new Date('2024-01-01')
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings: updateSettingsContext } = useSettings();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  // Initialize default users if not present
  useEffect(() => {
    if (!settings.users) {
      updateSettingsContext({
        ...settings,
        users: [defaultAdmin]
      });
    }
  }, [settings, updateSettingsContext]);

  const login = (username: string, password: string): boolean => {
    const users = settings.users || [defaultAdmin];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const canUserAccess = (requiredRole: UserRole | string): boolean => {
    if (!currentUser) return false;
    
    if (typeof requiredRole === 'string' && requiredRole !== 'admin' && requiredRole !== 'manager' && requiredRole !== 'user') {
      // Module-based access control
      return true; // For now, allow access to all modules
    }
    
    const roleHierarchy: Record<UserRole, number> = {
      'user': 1,
      'manager': 2,
      'admin': 3
    };
    
    const userLevel = roleHierarchy[currentUser.role];
    const requiredLevel = roleHierarchy[requiredRole as UserRole];
    
    return userLevel >= requiredLevel;
  };

  const addTeam = (name: string) => {
    const newTeam: Team = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date()
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const updateTeam = (team: Team) => {
    setTeams(prev => prev.map(t => t.id === team.id ? team : t));
  };

  const deleteTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const updatedUsers = [...(settings.users || []), newUser];
    updateSettingsContext({
      ...settings,
      users: updatedUsers
    });
  };

  const updateUser = (user: User) => {
    const updatedUsers = (settings.users || []).map(u => u.id === user.id ? user : u);
    updateSettingsContext({
      ...settings,
      users: updatedUsers
    });
  };

  const deleteUser = (id: string) => {
    const updatedUsers = (settings.users || []).filter(u => u.id !== id);
    updateSettingsContext({
      ...settings,
      users: updatedUsers
    });
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    await updateSettingsContext(newSettings);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        teams,
        settings,
        login,
        logout,
        canUserAccess,
        updateSettings,
        addTeam,
        updateTeam,
        deleteTeam,
        addUser,
        updateUser,
        deleteUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
