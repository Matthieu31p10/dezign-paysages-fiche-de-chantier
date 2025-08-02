import { useApp } from '@/context/AppContext';

export const useSettingsPermissions = () => {
  const { canUserAccess } = useApp();

  return {
    canManageUsers: canUserAccess('admin'),
    canEditCompanySettings: canUserAccess('admin'),
    canManageTeams: canUserAccess('admin'),
    canViewAdvancedSettings: canUserAccess('admin'),
    canManageBackup: canUserAccess('admin'),
    canViewLoginHistory: canUserAccess('admin'),
    canViewErrors: process.env.NODE_ENV === 'development'
  };
};