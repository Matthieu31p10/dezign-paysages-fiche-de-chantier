
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

  const modules = [
    { id: 'projects', name: 'Projets' },
    { id: 'worklogs', name: 'Suivi' },
    { id: 'reports', name: 'Rapports' },
    { id: 'settings', name: 'Paramètres' },
  ];

  const handleSavePermissions = (user: UserType) => {
    // Dans une future version, on pourrait sauvegarder ces permissions
    // Pour l'instant, c'est juste un prototype visuel
    toast.success('Permissions mises à jour');
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
            <div className="grid grid-cols-5 p-3 font-medium bg-muted border-b">
              <div className="col-span-1">Utilisateur</div>
              {modules.map(module => (
                <div key={module.id} className="col-span-1 text-center">{module.name}</div>
              ))}
            </div>
            
            {settings.users && settings.users.map(user => (
              <div key={user.id} className="grid grid-cols-5 p-3 border-b items-center last:border-b-0">
                <div className="col-span-1 font-medium">
                  {user.name || user.username}
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                
                {modules.map(module => (
                  <div key={`${user.id}-${module.id}`} className="col-span-1 flex justify-center">
                    <Switch 
                      id={`${user.id}-${module.id}`}
                      checked={user.role === 'admin' || (user.role === 'manager' && module.id !== 'settings') || module.id === 'projects' || module.id === 'worklogs'}
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
