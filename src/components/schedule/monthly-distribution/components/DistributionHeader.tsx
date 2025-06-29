
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Save } from 'lucide-react';

interface DistributionHeaderProps {
  selectedTeam: string;
  teams: any[];
  isEditing: boolean;
  onTeamChange: (team: string) => void;
  onEditToggle: () => void;
  onSave: () => void;
}

const DistributionHeader: React.FC<DistributionHeaderProps> = ({
  selectedTeam,
  teams,
  isEditing,
  onTeamChange,
  onEditToggle,
  onSave
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Distribution annuelle des passages
        </CardTitle>
        
        <Select value={selectedTeam} onValueChange={onTeamChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sélectionner une équipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={onEditToggle}
        >
          {isEditing ? "Annuler" : "Modifier"}
        </Button>
        {isEditing && (
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        )}
      </div>
    </CardHeader>
  );
};

export default DistributionHeader;
