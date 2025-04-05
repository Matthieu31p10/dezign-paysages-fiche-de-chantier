
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '@/types/models';
import { AuthContextType } from './types';
import { toast } from 'sonner';
import { useSettings } from './SettingsContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key
const AUTH_STORAGE_KEY = 'landscaping-auth';

// Default admin user
const DEFAULT_ADMIN: User = {
  id: 'admin-default',
  username: 'admin',
  password: 'admin',
  role: 'admin',
  createdAt: new Date(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    currentUser: null,
    isAuthenticated: false,
  });
  const { settings, updateSettings } = useSettings();

  // Ensure default admin user exists
  useEffect(() => {
    const currentUsers = settings.users || [];
    if (currentUsers.length === 0) {
      updateSettings({
        users: [DEFAULT_ADMIN]
      });
    }
  }, [settings, updateSettings]);

  // Load auth data from localStorage on initial render
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) setAuth(JSON.parse(storedAuth));
    } catch (error) {
      console.error('Error loading auth from localStorage:', error);
    }
  }, []);

  // Save auth data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = settings.users || [];
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
      setAuth({
        currentUser: user,
        isAuthenticated: true,
      });
      toast.success(`Bienvenue, ${user.name || user.username}`);
      return true;
    }

    toast.error('Identifiant ou mot de passe incorrect');
    return false;
  };

  const logout = () => {
    setAuth({
      currentUser: null,
      isAuthenticated: false,
    });
    toast.success('Déconnexion réussie');
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): User | null => {
    const users = settings.users || [];
    if (users.some((u) => u.username.toLowerCase() === userData.username.toLowerCase())) {
      toast.error('Ce nom d\'utilisateur existe déjà');
      return null;
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    const updatedUsers = [...users, newUser];
    updateSettings({
      users: updatedUsers,
    });

    toast.success('Utilisateur ajouté avec succès');
    return newUser;
  };

  const updateUser = (updatedUser: User) => {
    const users = settings.users || [];
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    updateSettings({
      users: updatedUsers,
    });

    if (auth.currentUser && auth.currentUser.id === updatedUser.id) {
      setAuth({
        ...auth,
        currentUser: updatedUser,
      });
    }

    toast.success('Utilisateur mis à jour avec succès');
  };

  const deleteUser = (id: string) => {
    if (id === 'admin-default') {
      toast.error('Impossible de supprimer l\'administrateur par défaut');
      return;
    }

    if (auth.currentUser && auth.currentUser.id === id) {
      toast.error('Impossible de supprimer votre propre compte');
      return;
    }

    const users = settings.users || [];
    const updatedUsers = users.filter((user) => user.id !== id);

    updateSettings({
      users: updatedUsers,
    });

    toast.success('Utilisateur supprimé avec succès');
  };

  const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };

  const canUserAccess = (requiredRole: UserRole): boolean => {
    if (!auth.isAuthenticated || !auth.currentUser) {
      return false;
    }

    const userRole = auth.currentUser.role;

    switch (requiredRole) {
      case 'user':
        return true;
      case 'manager':
        return userRole === 'manager' || userRole === 'admin';
      case 'admin':
        return userRole === 'admin';
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        getCurrentUser,
        canUserAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
