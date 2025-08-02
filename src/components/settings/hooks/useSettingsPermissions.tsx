import { useAdvancedPermissions } from '@/hooks/usePermissions';

/**
 * Hook spécialisé pour les permissions des paramètres
 * @deprecated Utilisez useAdvancedPermissions à la place
 */
export const useSettingsPermissions = () => {
  const permissions = useAdvancedPermissions();

  return {
    canManageUsers: permissions.canManageUsers,
    canEditCompanySettings: permissions.canEditCompanySettings,
    canManageTeams: permissions.canManageTeams,
    canViewAdvancedSettings: permissions.canViewAdvancedSettings,
    canManageBackup: permissions.canManageBackup,
    canViewLoginHistory: permissions.canViewLoginHistory,
    canViewErrors: permissions.canViewErrors
  };
};