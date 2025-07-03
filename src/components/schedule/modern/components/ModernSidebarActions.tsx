
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Settings, Calendar, Users } from 'lucide-react';
import AnnualDistributionDialog from '../../annual-distribution/AnnualDistributionDialog';
import ProjectLocksManager from '../../project-locks/components/ProjectLocksManager';
import { useProjects } from '@/context/ProjectsContext';
import { useTeams } from '@/context/TeamsContext';
import { useApp } from '@/context/AppContext';

interface ModernSidebarActionsProps {
  onConstraintsClick: () => void;
  onDistributionClick: () => void;
  onTeamsClick: () => void;
}

const ModernSidebarActions: React.FC<ModernSidebarActionsProps> = ({
  onConstraintsClick,
  onDistributionClick,
  onTeamsClick
}) => {
  const [showAnnualDistributionDialog, setShowAnnualDistributionDialog] = useState(false);
  const [showConstraintsDialog, setShowConstraintsDialog] = useState(false);
  const { getActiveProjects } = useProjects();
  const { teams } = useTeams();
  const { projectInfos } = useApp();

  const handleDistributionClick = () => {
    setShowAnnualDistributionDialog(true);
  };

  const handleConstraintsClick = () => {
    setShowConstraintsDialog(true);
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm h-10 hover:bg-blue-50 hover:text-blue-700"
            onClick={handleConstraintsClick}
          >
            <Settings className="h-4 w-4 mr-2" />
            Gérer les contraintes
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm h-10 hover:bg-green-50 hover:text-green-700"
            onClick={handleDistributionClick}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Distribution annuelle des passages
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm h-10 hover:bg-purple-50 hover:text-purple-700"
            onClick={onTeamsClick}
          >
            <Users className="h-4 w-4 mr-2" />
            Gestion des équipes
          </Button>
        </CardContent>
      </Card>

      <AnnualDistributionDialog
        open={showAnnualDistributionDialog}
        onOpenChange={setShowAnnualDistributionDialog}
        projects={getActiveProjects()}
        teams={teams}
      />

      {showConstraintsDialog && (
        <ProjectLocksManager 
          projects={projectInfos}
          open={showConstraintsDialog}
          onOpenChange={setShowConstraintsDialog}
        />
      )}
    </>
  );
};

export default ModernSidebarActions;
