import React from 'react';
import { usePermissions } from '@/context/PermissionsContext';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import PermissionGate from '@/components/common/PermissionGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const SecurityPage = () => {
  const { hasPermission } = usePermissions();

  return (
    <div className="container mx-auto p-6">
      <PermissionGate
        permission="system.security"
        fallback={
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Accès refusé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vous n'avez pas les permissions nécessaires pour accéder au tableau de bord de sécurité.
                Contactez un administrateur pour obtenir l'accès à cette fonctionnalité.
              </p>
            </CardContent>
          </Card>
        }
      >
        <SecurityDashboard />
      </PermissionGate>
    </div>
  );
};

export default SecurityPage;