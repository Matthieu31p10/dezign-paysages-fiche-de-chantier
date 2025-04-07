
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User as UserType } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface AccessControlProps {
  isAdmin: boolean;
}

const AccessControl = ({ isAdmin }: AccessControlProps) => {
  const { settings, updateUser } = useApp();
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});

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
  ];

  const handleSavePermissions = (user: UserType) => {
    // Dans une future version, on pourrait sauvegarder ces permissions
    // Pour l'instant, c'est juste un prototype visuel
    toast.success('Permissions mises à jour');
  };

  // Vérifier si un utilisateur a accès à un module
  const hasModuleAccess = (userId: string, moduleId: string) => {
    // Pour l'instant, on utilise les rôles existants pour déterminer l'accès
    const user = settings.users?.find(u => u.id === userId);
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    if (user.role === 'manager' && moduleId !== 'settings') return true;
    if (moduleId === 'projects' || moduleId === 'worklogs' || moduleId === 'blanksheets') return true;
    
    return false;
  };

  // Vérifier si un utilisateur a une permission spécifique
  const hasPermission = (userId: string, permissionId: string) => {
    const user = settings.users?.find(u => u.id === userId);
    if (!user) return false;
    
    // Admin a toutes les permissions
    if (user.role === 'admin') return true;
    
    // Gestionnaire a toutes les permissions sauf paramètres
    if (user.role === 'manager') {
      if (permissionId.startsWith('settings')) return false;
      return true;
    }
    
    // Utilisateur standard a des permissions en lecture par défaut
    if (permissionId === 'projects.read' || permissionId === 'worklogs.read' || permissionId === 'blanksheets.read') return true;
    
    return false;
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
            Cette fonctionnalité permettra de définir précisément quels utilisateurs ont accès à quelles parties de l'application.
            Actuellement, les accès sont gérés par le système de rôles (Administrateur, Gestionnaire, Utilisateur).
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
                          setPermissions(prev => ({
                            ...prev,
                            [user.id]: {
                              ...(prev[user.id] || {}),
                              [module.id]: checked
                            }
                          }));
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
                                  setPermissions(prev => ({
                                    ...prev,
                                    [user.id]: {
                                      ...(prev[user.id] || {}),
                                      [permission.id]: checked
                                    }
                                  }));
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
          
          <div className="flex justify-end">
            <Button onClick={() => toast.info('Fonctionnalité à venir dans une prochaine version')}>
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
