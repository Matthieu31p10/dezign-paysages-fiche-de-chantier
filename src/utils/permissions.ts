import { PermissionLevel, Permission, SYSTEM_PERMISSIONS } from '@/types/permissions';

/**
 * Vérifie si un niveau de permission est suffisant pour une permission donnée
 */
export const hasPermissionLevel = (userLevel: PermissionLevel, requiredLevel: PermissionLevel): boolean => {
  const levels: Record<PermissionLevel, number> = {
    'readonly': 0,
    'user': 1,
    'manager': 2,
    'admin': 3
  };
  
  return levels[userLevel] >= levels[requiredLevel];
};

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export const checkPermission = (
  permission: Permission,
  userLevel: PermissionLevel,
  customPermissions?: Record<string, boolean>,
  restrictions?: string[]
): boolean => {
  // Vérification des restrictions explicites
  if (restrictions?.includes(permission.id)) {
    return false;
  }

  // Vérification des permissions personnalisées
  if (customPermissions && permission.id in customPermissions) {
    return customPermissions[permission.id];
  }

  // Vérification du mode développement
  if (permission.isDevelopment && process.env.NODE_ENV !== 'development') {
    return false;
  }

  // Vérification des droits système admin
  if (permission.isSystemAdmin && userLevel !== 'admin') {
    return false;
  }

  // Vérification du niveau de permission
  return hasPermissionLevel(userLevel, permission.requiredLevel);
};

/**
 * Obtient toutes les permissions disponibles pour un utilisateur
 */
export const getUserAvailablePermissions = (
  userLevel: PermissionLevel,
  customPermissions?: Record<string, boolean>,
  restrictions?: string[]
): Permission[] => {
  return SYSTEM_PERMISSIONS.filter(permission => 
    checkPermission(permission, userLevel, customPermissions, restrictions)
  );
};

/**
 * Obtient les permissions par catégorie
 */
export const getPermissionsByCategory = (permissions: Permission[]) => {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

/**
 * Trouve une permission par son ID
 */
export const findPermission = (permissionId: string): Permission | undefined => {
  return SYSTEM_PERMISSIONS.find(p => p.id === permissionId);
};