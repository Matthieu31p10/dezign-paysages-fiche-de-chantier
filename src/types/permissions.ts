// Types pour le système de permissions
export type PermissionLevel = 'admin' | 'manager' | 'user' | 'readonly';

export type PermissionCategory = 
  | 'projects' 
  | 'worklogs' 
  | 'blanklogs' 
  | 'reports' 
  | 'schedule' 
  | 'teams' 
  | 'settings' 
  | 'users' 
  | 'backup' 
  | 'system';

export type PermissionAction = 
  | 'view' 
  | 'create' 
  | 'edit' 
  | 'delete' 
  | 'archive' 
  | 'export' 
  | 'manage';

export interface Permission {
  id: string;
  category: PermissionCategory;
  action: PermissionAction;
  description: string;
  requiredLevel: PermissionLevel;
  isSystemAdmin?: boolean; // Nécessite des droits système
  isDevelopment?: boolean; // Disponible uniquement en développement
}

export interface UserPermissions {
  level: PermissionLevel;
  customPermissions?: Record<string, boolean>;
  restrictions?: string[]; // IDs des permissions explicitement refusées
}

// Permissions prédéfinies du système
export const SYSTEM_PERMISSIONS: Permission[] = [
  // Projets/Chantiers
  { id: 'projects.view', category: 'projects', action: 'view', description: 'Consulter les chantiers', requiredLevel: 'user' },
  { id: 'projects.create', category: 'projects', action: 'create', description: 'Créer des chantiers', requiredLevel: 'manager' },
  { id: 'projects.edit', category: 'projects', action: 'edit', description: 'Modifier les chantiers', requiredLevel: 'manager' },
  { id: 'projects.delete', category: 'projects', action: 'delete', description: 'Supprimer les chantiers', requiredLevel: 'admin' },
  { id: 'projects.archive', category: 'projects', action: 'archive', description: 'Archiver les chantiers', requiredLevel: 'manager' },

  // Fiches de suivi
  { id: 'worklogs.view', category: 'worklogs', action: 'view', description: 'Consulter les fiches de suivi', requiredLevel: 'user' },
  { id: 'worklogs.create', category: 'worklogs', action: 'create', description: 'Créer des fiches de suivi', requiredLevel: 'user' },
  { id: 'worklogs.edit', category: 'worklogs', action: 'edit', description: 'Modifier les fiches de suivi', requiredLevel: 'user' },
  { id: 'worklogs.delete', category: 'worklogs', action: 'delete', description: 'Supprimer les fiches de suivi', requiredLevel: 'manager' },
  { id: 'worklogs.export', category: 'worklogs', action: 'export', description: 'Exporter les fiches de suivi', requiredLevel: 'user' },

  // Fiches vierges
  { id: 'blanklogs.view', category: 'blanklogs', action: 'view', description: 'Consulter les fiches vierges', requiredLevel: 'user' },
  { id: 'blanklogs.create', category: 'blanklogs', action: 'create', description: 'Créer des fiches vierges', requiredLevel: 'user' },
  { id: 'blanklogs.edit', category: 'blanklogs', action: 'edit', description: 'Modifier les fiches vierges', requiredLevel: 'user' },
  { id: 'blanklogs.delete', category: 'blanklogs', action: 'delete', description: 'Supprimer les fiches vierges', requiredLevel: 'manager' },

  // Rapports et bilans
  { id: 'reports.view', category: 'reports', action: 'view', description: 'Consulter les bilans', requiredLevel: 'user' },
  { id: 'reports.export', category: 'reports', action: 'export', description: 'Exporter les rapports', requiredLevel: 'user' },
  { id: 'reports.manage', category: 'reports', action: 'manage', description: 'Gérer les paramètres de rapports', requiredLevel: 'manager' },

  // Planification
  { id: 'schedule.view', category: 'schedule', action: 'view', description: 'Consulter la planification', requiredLevel: 'user' },
  { id: 'schedule.edit', category: 'schedule', action: 'edit', description: 'Modifier la planification', requiredLevel: 'manager' },

  // Équipes
  { id: 'teams.view', category: 'teams', action: 'view', description: 'Consulter les équipes', requiredLevel: 'user' },
  { id: 'teams.manage', category: 'teams', action: 'manage', description: 'Gérer les équipes', requiredLevel: 'admin' },

  // Paramètres
  { id: 'settings.view', category: 'settings', action: 'view', description: 'Accéder aux paramètres', requiredLevel: 'user' },
  { id: 'settings.edit', category: 'settings', action: 'edit', description: 'Modifier les paramètres de base', requiredLevel: 'manager' },
  { id: 'settings.manage', category: 'settings', action: 'manage', description: 'Gérer tous les paramètres', requiredLevel: 'admin' },

  // Utilisateurs
  { id: 'users.view', category: 'users', action: 'view', description: 'Consulter les utilisateurs', requiredLevel: 'admin' },
  { id: 'users.manage', category: 'users', action: 'manage', description: 'Gérer les utilisateurs', requiredLevel: 'admin' },

  // Sauvegardes
  { id: 'backup.view', category: 'backup', action: 'view', description: 'Consulter les sauvegardes', requiredLevel: 'admin' },
  { id: 'backup.manage', category: 'backup', action: 'manage', description: 'Gérer les sauvegardes', requiredLevel: 'admin' },

  // Système
  { id: 'system.logs', category: 'system', action: 'view', description: 'Consulter les logs système', requiredLevel: 'admin', isDevelopment: true },
  { id: 'system.errors', category: 'system', action: 'view', description: 'Consulter les erreurs', requiredLevel: 'admin', isDevelopment: true },
  { id: 'system.admin', category: 'system', action: 'manage', description: 'Administration système', requiredLevel: 'admin', isSystemAdmin: true },
];