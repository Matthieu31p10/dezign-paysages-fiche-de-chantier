import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Building2, Home, Landmark, Users } from 'lucide-react';
import { Team } from '@/types/models';

interface ProjectsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedTeam: string;
  onTeamChange: (value: string) => void;
  teams: Team[];
}

const ProjectsFilters = ({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedTeam,
  onTeamChange,
  teams
}: ProjectsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un chantier..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full md:w-56">
          <SelectValue placeholder="Type de chantier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="residence">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-500" />
              <span>Résidence</span>
            </div>
          </SelectItem>
          <SelectItem value="particular">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-400" />
              <span>Particulier</span>
            </div>
          </SelectItem>
          <SelectItem value="enterprise">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-orange-500" />
              <span>Entreprise</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={selectedTeam} onValueChange={onTeamChange}>
        <SelectTrigger className="w-full md:w-56">
          <SelectValue placeholder="Équipe responsable" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les équipes</SelectItem>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{team.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectsFilters;