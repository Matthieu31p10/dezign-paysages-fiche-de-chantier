import React, { createContext, useContext, ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import { PermissionLevel, UserPermissions } from '@/types/permissions';
import { checkPermission, findPermission, getUserAvailablePermissions } from '@/utils/permissions';

interface PermissionsContextType {
  userLevel: PermissionLevel;
  userPermissions: UserPermissions;
  hasPermission: (permissionId: string) => boolean;
  canAccess: (permissionIds: string | string[]) => boolean;
  availablePermissions: ReturnType<typeof getUserAvailablePermissions>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider = ({ children }: PermissionsProviderProps) => {
  const { canUserAccess } = useApp();
  
  // Déterminer le niveau utilisateur basé sur les permissions existantes
  const userLevel: PermissionLevel = canUserAccess('admin') ? 'admin' : 'user';
  
  const userPermissions: UserPermissions = {
    level: userLevel,
    customPermissions: {},
    restrictions: []
  };

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  const hasPermission = (permissionId: string): boolean => {
    const permission = findPermission(permissionId);
    if (!permission) {
      console.warn(`Permission inconnue: ${permissionId}`);
      return false;
    }
    
    return checkPermission(
      permission, 
      userPermissions.level, 
      userPermissions.customPermissions,
      userPermissions.restrictions
    );
  };

  /**
   * Vérifie si l'utilisateur peut accéder à une ou plusieurs permissions
   */
  const canAccess = (permissionIds: string | string[]): boolean => {
    const ids = Array.isArray(permissionIds) ? permissionIds : [permissionIds];
    return ids.some(id => hasPermission(id));
  };

  // Obtenir toutes les permissions disponibles pour cet utilisateur
  const availablePermissions = getUserAvailablePermissions(
    userPermissions.level,
    userPermissions.customPermissions,
    userPermissions.restrictions
  );

  const value: PermissionsContextType = {
    userLevel,
    userPermissions,
    hasPermission,
    canAccess,
    availablePermissions
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte des permissions
 */
export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions doit être utilisé dans un PermissionsProvider');
  }
  return context;
};