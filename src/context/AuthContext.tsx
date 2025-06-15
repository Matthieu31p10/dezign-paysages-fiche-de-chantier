
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '@/types/models';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: 'admin-default',
      username: 'admin',
      password: 'admin',
      role: 'admin',
      name: 'Administrateur',
      email: 'admin@example.com',
      createdAt: new Date(),
      permissions: {
        admin: true,
        projects: true,
        worklogs: true,
        reports: true,
        blanksheets: true
      }
    }
  ]);

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        console.error('Error parsing saved auth state:', error);
      }
    }
  }, []);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(auth));
  }, [auth]);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setAuth({
        isAuthenticated: true,
        currentUser: user
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      currentUser: null
    });
    localStorage.removeItem('authState');
  };

  const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };

  const canUserAccess = (requiredRole: UserRole): boolean => {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // Admin a accès à tout
    if (currentUser.role === 'admin') return true;
    
    // Vérifier les permissions spécifiques
    return currentUser.permissions?.[requiredRole] === true;
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): User | null => {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(u => u.username === userData.username);
    if (existingUser) {
      return null;
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateUserPermissions = (userId: string, permissions: Record<string, boolean>) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, permissions: { ...u.permissions, ...permissions } } : u
    ));
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
        users,
        updateUserPermissions,
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
