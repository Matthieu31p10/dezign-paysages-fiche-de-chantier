import React, { ReactNode } from 'react';
import { usePermissions } from '@/context/PermissionsContext';

interface PermissionGateProps {
  children: ReactNode;
  permission: string | string[];
  fallback?: ReactNode;
  requireAll?: boolean; // Si true, toutes les permissions sont requises, sinon une seule suffit
}

/**
 * Composant garde qui affiche son contenu uniquement si l'utilisateur a les permissions requises
 */
const PermissionGate = ({ 
  children, 
  permission, 
  fallback = null, 
  requireAll = false 
}: PermissionGateProps) => {
  const { hasPermission } = usePermissions();
  
  const permissions = Array.isArray(permission) ? permission : [permission];
  
  const hasAccess = requireAll 
    ? permissions.every(p => hasPermission(p))
    : permissions.some(p => hasPermission(p));
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;