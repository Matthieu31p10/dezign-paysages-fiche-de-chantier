
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ClientVisibilityPermissions } from '@/types/models';
import { 
  Building, 
  Users, 
  FileText, 
  Clock, 
  Wrench,
  FolderOpen
} from 'lucide-react';

interface ClientVisibilityPermissionsProps {
  permissions: ClientVisibilityPermissions;
  onPermissionChange: (key: keyof ClientVisibilityPermissions, value: boolean) => void;
}

const ClientVisibilityPermissionsComponent: React.FC<ClientVisibilityPermissionsProps> = ({
  permissions,
  onPermissionChange
}) => {
  const permissionSections = [
    {
      title: "Informations générales",
      icon: <Building className="h-4 w-4" />,
      permissions: [
        { key: 'showProjectName' as const, label: 'Nom du chantier' },
        { key: 'showClientName' as const, label: 'Nom du client' },
        { key: 'showAddress' as const, label: 'Adresse' },
        { key: 'showContactInfo' as const, label: 'Informations de contact' },
        { key: 'showProjectType' as const, label: 'Type de chantier' },
        { key: 'showTeam' as const, label: 'Équipe assignée' },
      ]
    },
    {
      title: "Informations contractuelles",
      icon: <FileText className="h-4 w-4" />,
      permissions: [
        { key: 'showContractDetails' as const, label: 'Détails du contrat' },
        { key: 'showStartEndDates' as const, label: 'Dates début/fin' },
        { key: 'showAnnualVisits' as const, label: 'Nombre de passages annuels' },
        { key: 'showVisitDuration' as const, label: 'Durée des passages' },
        { key: 'showAdditionalInfo' as const, label: 'Informations supplémentaires' },
      ]
    },
    {
      title: "Informations techniques",
      icon: <Wrench className="h-4 w-4" />,
      permissions: [
        { key: 'showIrrigation' as const, label: 'Système d\'arrosage' },
        { key: 'showMowerType' as const, label: 'Type de tondeuse' },
      ]
    },
    {
      title: "Fiches de suivi",
      icon: <Clock className="h-4 w-4" />,
      permissions: [
        { key: 'showWorkLogs' as const, label: 'Afficher les fiches de suivi' },
        { key: 'showPersonnel' as const, label: 'Personnel présent' },
        { key: 'showTimeTracking' as const, label: 'Suivi des heures' },
        { key: 'showTasks' as const, label: 'Tâches effectuées' },
        { key: 'showWaterConsumption' as const, label: 'Consommation d\'eau' },
        { key: 'showNotes' as const, label: 'Notes et observations' },
        { key: 'showConsumables' as const, label: 'Consommables utilisés' },
        { key: 'showInvoicedStatus' as const, label: 'Statut facturation' },
      ]
    },
    {
      title: "Documents",
      icon: <FolderOpen className="h-4 w-4" />,
      permissions: [
        { key: 'showDocuments' as const, label: 'Documents du chantier' },
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Permissions de visibilité</h4>
        <p className="text-xs text-muted-foreground">
          Sélectionnez les informations que ce client pourra consulter
        </p>
      </div>
      
      {permissionSections.map((section, sectionIndex) => (
        <Card key={section.title}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {section.icon}
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.permissions.map((permission) => (
              <div key={permission.key} className="flex items-center justify-between">
                <Label htmlFor={permission.key} className="text-sm cursor-pointer">
                  {permission.label}
                </Label>
                <Switch
                  id={permission.key}
                  checked={permissions[permission.key] || false}
                  onCheckedChange={(checked) => onPermissionChange(permission.key, checked)}
                />
              </div>
            ))}
          </CardContent>
          {sectionIndex < permissionSections.length - 1 && <Separator />}
        </Card>
      ))}
    </div>
  );
};

export default ClientVisibilityPermissionsComponent;
