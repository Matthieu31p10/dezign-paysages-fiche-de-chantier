
import { useState, useTransition } from 'react';
import { Team } from '@/types/models';
import { Users, Building2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, List } from 'lucide-react';

interface ProjectFiltersProps {
  teams: Team[];
  selectedTeam: string;
  onTeamChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  viewMode: string;
  onViewModeChange: (value: string) => void;
  projectTypes?: string[];
  selectedProjectType?: string;
  onProjectTypeChange?: (value: string) => void;
}

const ProjectFilters = ({
  teams,
  selectedTeam,
  onTeamChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  projectTypes = [],
  selectedProjectType = 'all',
  onProjectTypeChange = () => {}
}: ProjectFiltersProps) => {
  // Safety check for data
  const validTeams = Array.isArray(teams) ? teams : [];
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <div className="w-full sm:w-auto">
        <Select
          value={selectedTeam}
          onValueChange={onTeamChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrer par équipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {validTeams.map(team => (
              <SelectItem key={team.id} value={team.id}>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {team.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {projectTypes.length > 0 && (
        <div className="w-full sm:w-auto">
          <Select
            value={selectedProjectType}
            onValueChange={onProjectTypeChange}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {projectTypes.map(type => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    {type === 'residence' ? 'Résidence' : 
                     type === 'particular' ? 'Particulier' : 
                     type === 'enterprise' ? 'Entreprise' : type}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <ToggleGroup 
        type="single" 
        value={viewMode} 
        onValueChange={onViewModeChange}
        className="border rounded-md hidden sm:flex"
      >
        <ToggleGroupItem value="grid" aria-label="Vue en grille">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="Vue en liste">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      
      <div className="w-full sm:w-auto ml-0 sm:ml-auto">
        <Select
          value={sortOption}
          onValueChange={onSortChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nom (A-Z)</SelectItem>
            <SelectItem value="lastVisit">Dernier passage (récent-ancien)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProjectFilters;
