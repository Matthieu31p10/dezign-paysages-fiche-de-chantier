
import React, { createContext, useContext, useState } from 'react';
import { AuthState, User, UserRole } from '@/types/models';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key
const AUTH_STORAGE_KEY = 'landscaping-auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  const initialAuth: AuthState = storedAuth 
    ? JSON.parse(storedAuth) 
    : { currentUser: null, isAuthenticated: false };

  const [auth, setAuth] = useState<AuthState>(initialAuth);
  const [users, setUsers] = useState<User[]>([]);

  // Login functionality
  const login = (username: string, password: string): boolean => {
    // Simplified login - replace with real authentication in production
    if (username === 'admin' && password === 'admin') {
      const user: User = {
        id: '1',
        username: 'admin',
        password: 'admin', // In a real app, this would be hashed
        role: 'admin',
        name: 'Administrator',
        createdAt: new Date(),
      };
      
      const newAuth = { currentUser: user, isAuthenticated: true };
      setAuth(newAuth);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuth));
      return true;
    }
    return false;
  };

  // Logout functionality
  const logout = () => {
    setAuth({ currentUser: null, isAuthenticated: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Add a new user
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): User | null => {
    // Check if username already exists
    const existingUser = users.find(user => user.username === userData.username);
    if (existingUser) return null;

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // Update a user
  const updateUser = (updatedUser: User) => {
    setUsers(prev => 
      prev.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
  };

  // Delete a user
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // Get the current user
  const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };

  // Check if the current user has the required role
  const canUserAccess = (requiredRole: UserRole): boolean => {
    if (!auth.currentUser) return false;
    
    const userRole = auth.currentUser.role;
    if (userRole === 'admin') return true;
    if (userRole === 'manager' && requiredRole !== 'admin') return true;
    if (userRole === 'user' && requiredRole === 'user') return true;
    
    return false;
  };

  // Update a user's permissions
  const updateUserPermissions = (userId: string, permissions: Record<string, boolean>) => {
    setUsers(prev => 
      prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            permissions: {
              ...(user.permissions || {}),
              ...permissions,
            },
          };
        }
        return user;
      })
    );
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
