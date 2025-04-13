
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
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        // Vérifier si l'utilisateur existe toujours dans les paramètres
        const users = settings.users || [];
        if (parsedAuth.currentUser && users.some(u => u.id === parsedAuth.currentUser.id)) {
          setAuth(parsedAuth);
        } else {
          // Si l'utilisateur n'existe plus, déconnexion
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading auth from localStorage:', error);
      // En cas d'erreur, supprimer les données potentiellement corrompues
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [settings.users]);

  // Save auth data to localStorage whenever it changes
  useEffect(() => {
    if (auth.isAuthenticated && auth.currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else if (!auth.isAuthenticated) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [auth]);

  const login = (username: string, password: string): boolean => {
    if (!username || !password) {
      toast.error('Veuillez remplir tous les champs');
      return false;
    }
    
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
    if (!userData.username || !userData.password) {
      toast.error('Le nom d\'utilisateur et le mot de passe sont obligatoires');
      return null;
    }
    
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
    if (!updatedUser.username) {
      toast.error('Le nom d\'utilisateur est obligatoire');
      return;
    }
    
    const users = settings.users || [];
    // Vérifier si le nom d'utilisateur existe déjà pour un autre utilisateur
    const usernameTaken = users.some(
      (u) => u.id !== updatedUser.id && u.username.toLowerCase() === updatedUser.username.toLowerCase()
    );
    
    if (usernameTaken) {
      toast.error('Ce nom d\'utilisateur existe déjà');
      return;
    }

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
