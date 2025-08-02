import React from 'react';
import { useAdvancedPermissions } from '@/hooks/usePermissions';
import PermissionGate from '@/components/common/PermissionGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Settings, Users } from 'lucide-react';

/**
 * Composant d'exemple montrant comment utiliser le nouveau système de permissions
 */
const PermissionsDemo = () => {
  const permissions = useAdvancedPermissions();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Système de permissions avancé
          </CardTitle>
          <CardDescription>
            Démonstration du nouveau système de gestion des permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Affichage du niveau utilisateur */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Niveau utilisateur :</span>
            <Badge variant={permissions.isAdmin ? "default" : "secondary"}>
              {permissions.userLevel}
            </Badge>
          </div>

          {/* Permissions spécifiques */}
          <div className="grid grid-cols-2 gap-4">
            <PermissionGate permission="projects.create">
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Créer un projet
              </Button>
            </PermissionGate>

            <PermissionGate permission="users.manage">
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Gérer les utilisateurs
              </Button>
            </PermissionGate>

            <PermissionGate 
              permission="reports.export"
              fallback={
                <Button variant="outline" disabled className="w-full">
                  Export non autorisé
                </Button>
              }
            >
              <Button variant="outline" className="w-full">
                Exporter les rapports
              </Button>
            </PermissionGate>

            <PermissionGate permission="system.admin">
              <Button variant="destructive" className="w-full">
                Administration système
              </Button>
            </PermissionGate>
          </div>

          {/* Liste des permissions disponibles */}
          <div>
            <h4 className="font-medium mb-2">Permissions disponibles :</h4>
            <div className="flex flex-wrap gap-1">
              {permissions.availablePermissions.map((perm) => (
                <Badge key={perm.id} variant="outline" className="text-xs">
                  {perm.id}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsDemo;