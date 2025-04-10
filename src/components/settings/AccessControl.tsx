
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Check, UserCheck, ShieldCheck } from 'lucide-react';

interface AccessControlProps {
  isAdmin?: boolean;
}

type Permission = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

type UserPermission = {
  userId: string;
  userName: string;
  permissions: Record<string, boolean>;
};

const AccessControl = ({ isAdmin }: AccessControlProps) => {
  const { users, updateUserPermissions } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  
  // Liste des permissions disponibles
  const availablePermissions: Permission[] = [
    { id: 'createProject', name: 'Créer des chantiers', description: 'Permet de créer de nouveaux chantiers', enabled: true },
    { id: 'editProject', name: 'Modifier des chantiers', description: 'Permet de modifier les informations des chantiers', enabled: true },
    { id: 'deleteProject', name: 'Supprimer des chantiers', description: 'Permet de supprimer des chantiers', enabled: false },
    { id: 'createWorkLog', name: 'Créer des fiches de suivi', description: 'Permet de créer des fiches de suivi', enabled: true },
    { id: 'createBlankWorksheet', name: 'Créer des fiches vierges', description: 'Permet de créer des fiches vierges', enabled: true },
    { id: 'exportPDF', name: 'Exporter en PDF', description: 'Permet d\'exporter des documents en PDF', enabled: true },
    { id: 'viewReports', name: 'Consulter les bilans', description: 'Permet de consulter les bilans et statistiques', enabled: true },
  ];
  
  // Initialisation des permissions utilisateur
  useEffect(() => {
    if (users && users.length > 0) {
      const initialUserPermissions = users.map(user => {
        // Si l'utilisateur n'a pas de permissions définies, on lui attribue les valeurs par défaut
        const permissions: Record<string, boolean> = {};
        availablePermissions.forEach(permission => {
          permissions[permission.id] = user.permissions?.[permission.id] ?? permission.enabled;
        });
        
        return {
          userId: user.id,
          userName: user.name || user.email,
          permissions
        };
      });
      
      setUserPermissions(initialUserPermissions);
      if (!selectedUserId && initialUserPermissions.length > 0) {
        setSelectedUserId(initialUserPermissions[0].userId);
      }
    }
  }, [users]);
  
  const handleUpdatePermission = (userId: string, permissionId: string, value: boolean) => {
    // Mettre à jour l'état local
    setUserPermissions(prevPermissions => 
      prevPermissions.map(userPerm => {
        if (userPerm.userId === userId) {
          return {
            ...userPerm,
            permissions: {
              ...userPerm.permissions,
              [permissionId]: value
            }
          };
        }
        return userPerm;
      })
    );
    
    // Mettre à jour les permissions dans le contexte
    const updatedPermissions = userPermissions.find(up => up.userId === userId)?.permissions || {};
    updatedPermissions[permissionId] = value;
    
    try {
      updateUserPermissions(userId, updatedPermissions);
      toast.success('Permissions mises à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des permissions');
      console.error(error);
    }
  };
  
  const selectedUser = userPermissions.find(up => up.userId === selectedUserId);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrôle d'accès</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 border rounded p-4">
            <h3 className="text-sm font-medium mb-3">Utilisateurs</h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-1">
                {userPermissions.map(userPerm => (
                  <Button
                    key={userPerm.userId}
                    variant={selectedUserId === userPerm.userId ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedUserId(userPerm.userId)}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {userPerm.userName}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="md:col-span-2 border rounded p-4">
            <h3 className="text-sm font-medium mb-3">Permissions de {selectedUser?.userName}</h3>
            {selectedUser ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {availablePermissions.map(permission => (
                    <div key={permission.id} className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">{permission.name}</Label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                      <Switch
                        checked={selectedUser.permissions[permission.id] || false}
                        onCheckedChange={(checked) => 
                          handleUpdatePermission(selectedUser.userId, permission.id, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Sélectionnez un utilisateur pour gérer ses permissions</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessControl;
