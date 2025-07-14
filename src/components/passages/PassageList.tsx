import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { PassageCard } from './PassageCard';
import { WorkLog } from '@/types/models';

interface PassageListProps {
  sortedPassages: WorkLog[];
  selectedProject: string;
  selectedTeam: string;
  getProjectName: (projectId: string) => string;
}

export const PassageList: React.FC<PassageListProps> = ({
  sortedPassages,
  selectedProject,
  selectedTeam,
  getProjectName
}) => {
  return (
    <Card className="bg-background border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5" />
          Historique des passages
        </CardTitle>
        <CardDescription>
          {selectedProject || selectedTeam
            ? `Passages filtrés ${selectedProject ? `pour "${getProjectName(selectedProject)}"` : ''} ${selectedTeam ? `équipe "${selectedTeam}"` : ''}`
            : 'Tous les passages effectués sur l\'ensemble des chantiers'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedPassages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {selectedProject || selectedTeam
                ? 'Aucun passage trouvé pour ces critères de recherche'
                : 'Aucun passage enregistré'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPassages.map((passage) => (
              <PassageCard 
                key={passage.id} 
                passage={passage} 
                getProjectName={getProjectName} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};