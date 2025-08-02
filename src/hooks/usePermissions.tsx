import { usePermissions } from '@/context/PermissionsContext';

/**
 * Hook avancé pour les permissions - remplace useSettingsPermissions
 */
export const useAdvancedPermissions = () => {
  const { hasPermission, canAccess, userLevel, availablePermissions } = usePermissions();

  return {
    // Permissions générales
    userLevel,
    availablePermissions,
    hasPermission,
    canAccess,

    // Permissions spécifiques pour les paramètres (compatibilité)
    canManageUsers: hasPermission('users.manage'),
    canEditCompanySettings: hasPermission('settings.manage'),
    canManageTeams: hasPermission('teams.manage'),
    canViewAdvancedSettings: hasPermission('settings.manage'),
    canManageBackup: hasPermission('backup.manage'),
    canViewLoginHistory: hasPermission('users.view'),
    canViewErrors: hasPermission('system.errors'),

    // Permissions pour les projets
    canViewProjects: hasPermission('projects.view'),
    canCreateProjects: hasPermission('projects.create'),
    canEditProjects: hasPermission('projects.edit'),
    canDeleteProjects: hasPermission('projects.delete'),
    canArchiveProjects: hasPermission('projects.archive'),

    // Permissions pour les fiches de suivi
    canViewWorkLogs: hasPermission('worklogs.view'),
    canCreateWorkLogs: hasPermission('worklogs.create'),
    canEditWorkLogs: hasPermission('worklogs.edit'),
    canDeleteWorkLogs: hasPermission('worklogs.delete'),
    canExportWorkLogs: hasPermission('worklogs.export'),

    // Permissions pour les fiches vierges
    canViewBlankLogs: hasPermission('blanklogs.view'),
    canCreateBlankLogs: hasPermission('blanklogs.create'),
    canEditBlankLogs: hasPermission('blanklogs.edit'),
    canDeleteBlankLogs: hasPermission('blanklogs.delete'),

    // Permissions pour les rapports
    canViewReports: hasPermission('reports.view'),
    canExportReports: hasPermission('reports.export'),
    canManageReports: hasPermission('reports.manage'),

    // Permissions pour la planification
    canViewSchedule: hasPermission('schedule.view'),
    canEditSchedule: hasPermission('schedule.edit'),

    // Fonctions utilitaires
    isAdmin: userLevel === 'admin',
    isManager: userLevel === 'manager' || userLevel === 'admin',
    isReadOnly: userLevel === 'readonly',
  };
};