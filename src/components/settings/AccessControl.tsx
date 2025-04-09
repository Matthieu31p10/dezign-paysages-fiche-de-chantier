
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User as UserType } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AccessControlProps {
  isAdmin: boolean;
}

const AccessControl = ({ isAdmin }: AccessControlProps) => {
  const { settings, updateUser } = useApp();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialiser les permissions à partir des rôles existants
  useState(() => {
    if (settings.users) {
      const initialPerms: Record<string, Record<string, boolean>> = {};
      settings.users.forEach(user => {
        initialPerms[user.id] = {};
        
        // Définir les permissions en fonction du rôle
        if (user.role === 'admin') {
          modules.forEach(mod => {
            initialPerms[user.id][mod.id] = true;
          });
          detailedPermissions.forEach(perm => {
            initialPerms[user.id][perm.id] = true;
          });
        } else if (user.role === 'manager') {
          modules.forEach(mod => {
            initialPerms[user.id][mod.id] = mod.id !== 'settings';
          });
          detailedPermissions.forEach(perm => {
            initialPerms[user.id][perm.id] = !perm.id.startsWith('settings');
          });
        } else {
          modules.forEach(mod => {
            initialPerms[user.id][mod.id] = ['projects', 'worklogs', 'blanksheets'].includes(mod.id);
          });
          detailedPermissions.forEach(perm => {
            initialPerms[user.id][perm.id] = perm.id.endsWith('.read');
          });
        }
      });
      
      setPermissions(initialPerms);
    }
  }, [settings.users]);

  // Modules accessibles dans l'application
  const modules = [
    { id: 'projects', name: 'Projets' },
    { id: 'worklogs', name: 'Suivi' },
    { id: 'blanksheets', name: 'Fiches vierges' },
    { id: 'reports', name: 'Rapports' },
    { id: 'settings', name: 'Paramètres' },
  ];

  // Permissions détaillées pour les projets et fiches de suivi
  const detailedPermissions = [
    { id: 'projects.read', name: 'Lecture fiches chantier', group: 'projects' },
    { id: 'projects.write', name: 'Modification fiches chantier', group: 'projects' },
    { id: 'worklogs.read', name: 'Lecture fiches suivi', group: 'worklogs' },
    { id: 'worklogs.write', name: 'Modification fiches suivi', group: 'worklogs' },
    { id: 'blanksheets.read', name: 'Lecture fiches vierges', group: 'blanksheets' },
    { id: 'blanksheets.write', name: 'Modification fiches vierges', group: 'blanksheets' },
    { id: 'reports.access', name: 'Accès aux rapports', group: 'reports' },
    { id: 'settings.users', name: 'Gestion des utilisateurs', group: 'settings' },
    { id: 'settings.company', name: 'Paramètres entreprise', group: 'settings' },
  ];

  const handlePermissionChange = (userId: string, permId: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        [permId]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSavePermissions = () => {
    if (!settings.users) return;
    
    // Dans une future version avec backend, on pourrait sauvegarder ces permissions directement
    // Pour l'instant, nous allons mettre à jour les rôles en fonction des permissions
    const updatedUsers = settings.users.map(user => {
      const userPerms = permissions[user.id] || {};
      
      // Déterminer le rôle en fonction des permissions
      let role: 'admin' | 'manager' | 'user' = 'user';
      
      // Si l'utilisateur a accès aux paramètres, c'est un admin
      if (userPerms['settings'] === true) {
        role = 'admin';
      }
      // Si l'utilisateur a accès à tout sauf les paramètres, c'est un manager
      else if (
        userPerms['projects'] === true && 
        userPerms['worklogs'] === true &&
        userPerms['reports'] === true
      ) {
        role = 'manager';
      }
      
      // Ne pas changer le rôle de l'admin par défaut
      if (user.id === 'admin-default') {
        role = 'admin';
      }
      
      return {
        ...user,
        role
      };
    });
    
    // Mettre à jour chaque utilisateur
    updatedUsers.forEach(user => {
      if (user.id !== 'admin-default') {
        updateUser(user);
      }
    });
    
    toast.success('Permissions mises à jour avec succès');
    setHasChanges(false);
  };

  // Vérifier si un utilisateur a accès à un module
  const hasModuleAccess = (userId: string, moduleId: string) => {
    return permissions[userId]?.[moduleId] === true;
  };

  // Vérifier si un utilisateur a une permission spécifique
  const hasPermission = (userId: string, permissionId: string) => {
    return permissions[userId]?.[permissionId] === true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrôle d'accès</CardTitle>
        <CardDescription>
          Gérez les accès des utilisateurs aux différentes fonctionnalités
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Définissez quels utilisateurs ont accès à quelles parties de l'application.
            Les modifications des permissions sont immédiatement appliquées après sauvegarde.
          </p>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-7 p-3 font-medium bg-muted border-b">
              <div className="col-span-2">Utilisateur</div>
              {modules.map(module => (
                <div key={module.id} className="col-span-1 text-center">{module.name}</div>
              ))}
            </div>
            
            {settings.users && settings.users.map(user => (
              <div key={user.id} className="border-b last:border-b-0">
                <div className="grid grid-cols-7 p-3 items-center">
                  <div className="col-span-2 font-medium">
                    {user.name || user.username}
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                  
                  {modules.map(module => (
                    <div key={`${user.id}-${module.id}`} className="col-span-1 flex justify-center">
                      <Switch 
                        id={`${user.id}-${module.id}`}
                        checked={hasModuleAccess(user.id, module.id)}
                        disabled={!isAdmin || user.id === 'admin-default'}
                        onCheckedChange={(checked) => {
                          handlePermissionChange(user.id, module.id, checked);
                          
                          // Si on désactive un module, désactiver aussi ses permissions détaillées
                          if (!checked) {
                            const modulePerms = detailedPermissions.filter(p => p.group === module.id);
                            modulePerms.forEach(perm => {
                              handlePermissionChange(user.id, perm.id, false);
                            });
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Permissions détaillées pour les projets et fiches de suivi */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                  <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-2 text-sm text-muted-foreground">
                      Permissions détaillées
                    </div>
                    
                    {modules.map(module => (
                      <div key={`${user.id}-${module.id}-detail`} className="col-span-1">
                        {detailedPermissions
                          .filter(p => p.group === module.id)
                          .map(permission => (
                            <div key={`${user.id}-${permission.id}`} className="flex items-center justify-between py-1">
                              <span className="text-xs">{permission.name}</span>
                              <Switch 
                                id={`${user.id}-${permission.id}`}
                                checked={hasPermission(user.id, permission.id)}
                                disabled={!isAdmin || user.id === 'admin-default' || !hasModuleAccess(user.id, module.id)}
                                className="scale-75"
                                onCheckedChange={(checked) => {
                                  handlePermissionChange(user.id, permission.id, checked);
                                }}
                              />
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate('/settings')}>
              Annuler
            </Button>
            <Button 
              onClick={handleSavePermissions}
              disabled={!isAdmin || !hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les permissions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessControl;
