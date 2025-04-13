
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileIcon } from 'lucide-react';

interface AlertInfoProps {
  sheetsCount: number;
  hasActiveProjects: boolean;
}

const AlertInfo: React.FC<AlertInfoProps> = ({ sheetsCount, hasActiveProjects }) => {
  return (
    <Alert className="bg-muted">
      <FileIcon className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        Vous avez {sheetsCount} fiche{sheetsCount > 1 ? 's' : ''} vierge{sheetsCount > 1 ? 's' : ''}. Ces fiches sont automatiquement incluses dans vos rapports statistiques mensuels.
        {hasActiveProjects && (
          <span className="block mt-1">
            Vous pouvez désormais associer vos fiches vierges à des projets existants lors de l'export en PDF.
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default AlertInfo;
