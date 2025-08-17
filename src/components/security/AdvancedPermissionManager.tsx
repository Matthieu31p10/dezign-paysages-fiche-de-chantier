import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Shield, 
  Settings, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { usePermissions } from '@/context/PermissionsContext';
import { SYSTEM_PERMISSIONS } from '@/types/permissions';
import { getPermissionsByCategory } from '@/utils/permissions';
import { toast } from 'sonner';

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystemRole: boolean;
  color: string;
}

interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  category: string;
}

const AdvancedPermissionManager = () => {
  const { hasPermission, availablePermissions } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [templates, setTemplates] = useState<PermissionTemplate[]>([]);
  const [showSystemPermissions, setShowSystemPermissions] = useState(false);

  const permissionsByCategory = getPermissionsByCategory(availablePermissions);

  useEffect(() => {
    // Charger les rôles existants
    const defaultRoles: UserRole[] = [
      {
        id: 'admin',
        name: 'Administrateur',
        description: 'Accès complet à toutes les fonctionnalités',
        permissions: availablePermissions.map(p => p.id),
        userCount: 1,
        isSystemRole: true,
        color: '#ef4444'
      },
      {
        id: 'manager',
        name: 'Gestionnaire',
        description: 'Accès aux fonctions de gestion et supervision',
        permissions: availablePermissions.filter(p => 
          p.requiredLevel === 'manager' || p.requiredLevel === 'user'
        ).map(p => p.id),
        userCount: 3,
        isSystemRole: true,
        color: '#f59e0b'
      },
      {
        id: 'user',
        name: 'Utilisateur',
        description: 'Accès standard aux fonctionnalités de base',
        permissions: availablePermissions.filter(p => 
          p.requiredLevel === 'user'
        ).map(p => p.id),
        userCount: 12,
        isSystemRole: true,
        color: '#10b981'
      },
      {
        id: 'readonly',
        name: 'Lecture seule',
        description: 'Accès en lecture uniquement',
        permissions: availablePermissions.filter(p => 
          p.id.includes('.view') || p.id.includes('.read')
        ).map(p => p.id),
        userCount: 5,
        isSystemRole: true,
        color: '#6b7280'
      }
    ];

    setRoles(defaultRoles);

    // Charger les modèles de permissions
    const defaultTemplates: PermissionTemplate[] = [
      {
        id: 'project-manager',
        name: 'Chef de projet',
        description: 'Gestion complète des projets et équipes',
        permissions: ['projects.create', 'projects.edit', 'projects.view', 'teams.manage', 'worklogs.view'],
        category: 'Gestion'
      },
      {
        id: 'accountant',
        name: 'Comptable',
        description: 'Accès aux rapports financiers et facturation',
        permissions: ['reports.view', 'reports.export', 'worklogs.view', 'projects.view'],
        category: 'Finance'
      },
      {
        id: 'field-worker',
        name: 'Technicien terrain',
        description: 'Création et modification des fiches de suivi',
        permissions: ['worklogs.create', 'worklogs.edit', 'worklogs.view', 'blanklogs.create'],
        category: 'Terrain'
      }
    ];

    setTemplates(defaultTemplates);
  }, [availablePermissions]);

  const handleRolePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(prevRoles => 
      prevRoles.map(role => {
        if (role.id === roleId) {
          const hasPermission = role.permissions.includes(permissionId);
          return {
            ...role,
            permissions: hasPermission 
              ? role.permissions.filter(p => p !== permissionId)
              : [...role.permissions, permissionId]
          };
        }
        return role;
      })
    );
  };

  const createRoleFromTemplate = (template: PermissionTemplate) => {
    const newRole: UserRole = {
      id: `custom-${Date.now()}`,
      name: template.name,
      description: template.description,
      permissions: template.permissions,
      userCount: 0,
      isSystemRole: false,
      color: '#8b5cf6'
    };

    setRoles(prev => [...prev, newRole]);
    setSelectedRole(newRole);
    toast.success(`Rôle "${template.name}" créé avec succès`);
  };

  const duplicateRole = (role: UserRole) => {
    const newRole: UserRole = {
      ...role,
      id: `custom-${Date.now()}`,
      name: `${role.name} (Copie)`,
      userCount: 0,
      isSystemRole: false,
      color: '#8b5cf6'
    };

    setRoles(prev => [...prev, newRole]);
    setSelectedRole(newRole);
    toast.success(`Rôle dupliqué avec succès`);
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystemRole) {
      toast.error('Impossible de supprimer un rôle système');
      return;
    }

    setRoles(prev => prev.filter(r => r.id !== roleId));
    if (selectedRole?.id === roleId) {
      setSelectedRole(null);
    }
    toast.success('Rôle supprimé avec succès');
  };

  const filteredPermissions = availablePermissions.filter(permission => {
    const matchesSearch = permission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const isSystemPermission = permission.isSystemAdmin;
    
    return matchesSearch && (showSystemPermissions || !isSystemPermission);
  });

  const filteredPermissionsByCategory = getPermissionsByCategory(filteredPermissions);

  if (!hasPermission('users.manage')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accès refusé</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour gérer les permissions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestionnaire de permissions avancé
          </CardTitle>
          <CardDescription>
            Créez et gérez des rôles personnalisés avec des permissions granulaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="roles">Rôles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Liste des rôles */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Nouveau rôle
                      </Button>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {roles.map((role) => (
                          <Card 
                            key={role.id}
                            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                              selectedRole?.id === role.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedRole(role)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: role.color }}
                                  />
                                  <div>
                                    <h4 className="font-medium">{role.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {role.userCount} utilisateur(s)
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {role.isSystemRole && (
                                    <Badge variant="secondary" className="text-xs">
                                      Système
                                    </Badge>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      duplicateRole(role);
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  {!role.isSystemRole && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteRole(role.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                {/* Détails du rôle */}
                <div className="lg:col-span-2">
                  {selectedRole ? (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{selectedRole.name}</CardTitle>
                            <CardDescription>{selectedRole.description}</CardDescription>
                          </div>
                          <Button size="sm" className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Sauvegarder
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Permissions ({selectedRole.permissions.length})</h4>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={showSystemPermissions}
                                onCheckedChange={setShowSystemPermissions}
                              />
                              <span className="text-sm">Permissions système</span>
                            </div>
                          </div>
                          
                          <ScrollArea className="h-[300px]">
                            <div className="space-y-4">
                              {Object.entries(filteredPermissionsByCategory).map(([category, permissions]) => (
                                <div key={category}>
                                  <h5 className="font-medium text-sm mb-2 text-muted-foreground uppercase tracking-wide">
                                    {category}
                                  </h5>
                                  <div className="space-y-2 mb-4">
                                    {permissions.map((permission) => (
                                      <div key={permission.id} className="flex items-center justify-between p-2 rounded-lg border">
                                        <div>
                                          <p className="font-medium text-sm">{permission.id}</p>
                                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                                        </div>
                                        <Switch
                                          checked={selectedRole.permissions.includes(permission.id)}
                                          onCheckedChange={() => handleRolePermissionToggle(selectedRole.id, permission.id)}
                                          disabled={selectedRole.isSystemRole}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Sélectionnez un rôle pour modifier ses permissions
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showSystemPermissions}
                    onCheckedChange={setShowSystemPermissions}
                  />
                  <span className="text-sm">Permissions système</span>
                </div>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  {Object.entries(filteredPermissionsByCategory).map(([category, permissions]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-3">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {permissions.map((permission) => (
                          <Card key={permission.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm mb-1">{permission.name}</h4>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {permission.description}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {permission.requiredLevel}
                                    </Badge>
                                    {permission.isSystemAdmin && (
                                      <Badge variant="destructive" className="text-xs">
                                        Système
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {template.permissions.length} permission(s)
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {template.permissions.slice(0, 3).map((permId) => {
                              const perm = SYSTEM_PERMISSIONS.find(p => p.id === permId);
                              return perm ? (
                                <Badge key={permId} variant="secondary" className="text-xs">
                                  {perm.name}
                                </Badge>
                              ) : null;
                            })}
                            {template.permissions.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.permissions.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => createRoleFromTemplate(template)}
                        >
                          Utiliser ce modèle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedPermissionManager;