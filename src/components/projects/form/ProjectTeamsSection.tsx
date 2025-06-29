
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Star } from 'lucide-react';
import { useTeams } from '@/context/TeamsContext';
import { useProjectTeams } from '@/hooks/useProjectTeams';
import { ProjectTeam } from '@/types/models';
import TeamBadge from '@/components/ui/team-badge';

interface ProjectTeamsSectionProps {
  projectId?: string;
  projectTeams: ProjectTeam[];
  onTeamsChange: (teams: ProjectTeam[]) => void;
}

const ProjectTeamsSection: React.FC<ProjectTeamsSectionProps> = ({
  projectId,
  projectTeams,
  onTeamsChange
}) => {
  const { teams } = useTeams();
  const { addProjectTeam, removeProjectTeam, updateProjectTeam } = useProjectTeams();
  const [selectedTeamId, setSelectedTeamId] = React.useState<string>('');

  const availableTeams = teams.filter(team => 
    !projectTeams.some(pt => pt.teamId === team.id)
  );

  const handleAddTeam = async () => {
    if (!selectedTeamId || !projectId) return;

    try {
      const isPrimary = projectTeams.length === 0; // Première équipe = primaire
      const newProjectTeam = await addProjectTeam(projectId, selectedTeamId, isPrimary);
      onTeamsChange([...projectTeams, newProjectTeam]);
      setSelectedTeamId('');
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handleRemoveTeam = async (projectTeamId: string) => {
    if (!projectId) return;

    try {
      await removeProjectTeam(projectTeamId);
      onTeamsChange(projectTeams.filter(pt => pt.id !== projectTeamId));
    } catch (error) {
      console.error('Error removing team:', error);
    }
  };

  const handleSetPrimary = async (projectTeamId: string) => {
    if (!projectId) return;

    try {
      // Retirer le statut primaire des autres équipes
      const updates = projectTeams.map(async pt => {
        if (pt.id === projectTeamId) {
          await updateProjectTeam(pt.id, { isPrimary: true });
          return { ...pt, isPrimary: true };
        } else if (pt.isPrimary) {
          await updateProjectTeam(pt.id, { isPrimary: false });
          return { ...pt, isPrimary: false };
        }
        return pt;
      });

      const updatedTeams = await Promise.all(updates);
      onTeamsChange(updatedTeams);
    } catch (error) {
      console.error('Error setting primary team:', error);
    }
  };

  const getTeamById = (teamId: string) => teams.find(t => t.id === teamId);

  return (
    <div className="space-y-4">
      <Label>Équipes assignées</Label>
      
      {/* Liste des équipes assignées */}
      <div className="space-y-2">
        {projectTeams.map((projectTeam) => {
          const team = getTeamById(projectTeam.teamId);
          if (!team) return null;

          return (
            <div key={projectTeam.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <TeamBadge teamName={team.name} teamColor={team.color} size="sm" />
                {projectTeam.isPrimary && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Primaire
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!projectTeam.isPrimary && projectTeams.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPrimary(projectTeam.id)}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                {projectTeams.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTeam(projectTeam.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ajouter une nouvelle équipe */}
      {availableTeams.length > 0 && (
        <div className="flex gap-2">
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sélectionner une équipe à ajouter" />
            </SelectTrigger>
            <SelectContent>
              {availableTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddTeam} 
            disabled={!selectedTeamId}
            size="sm"
            className="px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {projectTeams.length === 0 && (
        <p className="text-sm text-gray-500">
          Aucune équipe assignée à ce projet. Ajoutez au moins une équipe.
        </p>
      )}
    </div>
  );
};

export default ProjectTeamsSection;
