
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
  category: string;
};

type UserPermission = {
  userId: string;
  userName: string;
  permissions: Record<string, boolean>;
};

const AccessControl = ({ isAdmin }: AccessControlProps) => {
  const { settings, updateSettings } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  
  // Liste des permissions disponibles organisées par catégories
  const availablePermissions: Permission[] = [
    // Gestion des chantiers
    { id: 'createProject', name: 'Créer des chantiers', description: 'Permet de créer de nouveaux chantiers', enabled: true, category: 'Chantiers' },
    { id: 'editProject', name: 'Modifier des chantiers', description: 'Permet de modifier les informations des chantiers', enabled: true, category: 'Chantiers' },
    { id: 'deleteProject', name: 'Supprimer des chantiers', description: 'Permet de supprimer des chantiers', enabled: false, category: 'Chantiers' },
    { id: 'archiveProject', name: 'Archiver des chantiers', description: 'Permet d\'archiver/désarchiver des chantiers', enabled: true, category: 'Chantiers' },
    
    // Fiches de suivi
    { id: 'createWorkLog', name: 'Créer des fiches de suivi', description: 'Permet de créer des fiches de suivi', enabled: true, category: 'Fiches de suivi' },
    { id: 'editWorkLog', name: 'Modifier des fiches de suivi', description: 'Permet de modifier les fiches de suivi existantes', enabled: true, category: 'Fiches de suivi' },
    { id: 'deleteWorkLog', name: 'Supprimer des fiches de suivi', description: 'Permet de supprimer des fiches de suivi', enabled: false, category: 'Fiches de suivi' },
    
    // Fiches vierges
    { id: 'createBlankWorksheet', name: 'Créer des fiches vierges', description: 'Permet de créer des fiches vierges', enabled: true, category: 'Fiches vierges' },
    { id: 'editBlankWorksheet', name: 'Modifier des fiches vierges', description: 'Permet de modifier les fiches vierges', enabled: true, category: 'Fiches vierges' },
    { id: 'deleteBlankWorksheet', name: 'Supprimer des fiches vierges', description: 'Permet de supprimer des fiches vierges', enabled: false, category: 'Fiches vierges' },
    
    // Bilans et rapports
    { id: 'viewReports', name: 'Consulter les bilans', description: 'Permet de consulter les bilans et statistiques', enabled: true, category: 'Bilans' },
    { id: 'exportPDF', name: 'Exporter en PDF', description: 'Permet d\'exporter des documents en PDF', enabled: true, category: 'Bilans' },
    { id: 'viewGlobalStats', name: 'Voir les statistiques globales', description: 'Permet de voir les statistiques générales', enabled: true, category: 'Bilans' },
    { id: 'viewYearlyAnalysis', name: 'Analyse annuelle', description: 'Permet de consulter l\'analyse annuelle', enabled: true, category: 'Bilans' },
    
    // Planification
    { id: 'viewSchedule', name: 'Consulter la planification', description: 'Permet de voir le planning des interventions', enabled: true, category: 'Planification' },
    { id: 'editSchedule', name: 'Modifier la planification', description: 'Permet de modifier le planning', enabled: false, category: 'Planification' },
    
    // Gestion des équipes et personnel
    { id: 'manageTeams', name: 'Gérer les équipes', description: 'Permet de créer/modifier/supprimer les équipes', enabled: false, category: 'Équipes' },
    { id: 'managePersonnel', name: 'Gérer le personnel', description: 'Permet de gérer la liste du personnel', enabled: false, category: 'Équipes' },
    
    // Paramètres
    { id: 'viewSettings', name: 'Accéder aux paramètres', description: 'Permet d\'accéder à la page de paramètres', enabled: true, category: 'Paramètres' },
    { id: 'editCompanySettings', name: 'Modifier les infos entreprise', description: 'Permet de modifier les informations de l\'entreprise', enabled: false, category: 'Paramètres' },
    { id: 'manageUsers', name: 'Gérer les utilisateurs', description: 'Permet de créer/modifier/supprimer des utilisateurs', enabled: false, category: 'Paramètres' },
    { id: 'manageBackup', name: 'Gérer les sauvegardes', description: 'Permet d\'effectuer des sauvegardes/restaurations', enabled: false, category: 'Paramètres' },
  ];
  
  // Grouper les permissions par catégorie
  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
  
  // Initialisation des permissions utilisateur
  useEffect(() => {
    const users = settings?.users || [];
    if (users && users.length > 0) {
      const initialUserPermissions = users.map(user => {
        // Si l'utilisateur n'a pas de permissions définies, on lui attribue les valeurs par défaut
        const permissions: Record<string, boolean> = {};
        availablePermissions.forEach(permission => {
          permissions[permission.id] = user.permissions?.[permission.id] ?? permission.enabled;
        });
        
        return {
          userId: user.id,
          userName: user.name || user.username,
          permissions
        };
      });
      
      setUserPermissions(initialUserPermissions);
      if (!selectedUserId && initialUserPermissions.length > 0) {
        setSelectedUserId(initialUserPermissions[0].userId);
      }
    }
  }, [settings]);
  
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
    
    try {
      // Update the user permissions in settings
      const updatedUsers = (settings?.users || []).map(user => {
        if (user.id === userId) {
          return {
            ...user,
            permissions: {
              ...(user.permissions || {}),
              [permissionId]: value
            }
          };
        }
        return user;
      });
      
      updateSettings({ 
        users: updatedUsers 
      });
      
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
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          Contrôle d'accès par modules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 border rounded p-4">
            <h3 className="text-sm font-medium mb-3">Utilisateurs</h3>
            <ScrollArea className="h-[400px]">
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
          
          <div className="lg:col-span-2 border rounded p-4">
            <h3 className="text-sm font-medium mb-3">Permissions de {selectedUser?.userName}</h3>
            {selectedUser ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="text-sm font-semibold text-green-800 border-b border-green-200 pb-1">
                        {category}
                      </h4>
                      <div className="space-y-3 pl-2">
                        {permissions.map(permission => (
                          <div key={permission.id} className="flex items-center justify-between py-2">
                            <div className="flex-1">
                              <Label className="text-sm font-medium">{permission.name}</Label>
                              <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
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
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-[400px]">
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
