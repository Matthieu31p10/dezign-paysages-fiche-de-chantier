import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users } from 'lucide-react';

interface PassageFiltersProps {
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  selectedTeam: string;
  setSelectedTeam: (value: string) => void;
  activeProjects: Array<{ id: string; name: string }>;
  activeTeams: Array<{ id: string; name: string }>;
}

export const PassageFilters: React.FC<PassageFiltersProps> = ({
  selectedProject,
  setSelectedProject,
  selectedTeam,
  setSelectedTeam,
  activeProjects,
  activeTeams
}) => {
  return (
    <Card className="bg-background border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <MapPin className="h-5 w-5" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1 text-foreground">
              <MapPin className="h-4 w-4" />
              Chantier
            </label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Sélectionner un chantier" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="">Tous les chantiers</SelectItem>
                {activeProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1 text-foreground">
              <Users className="h-4 w-4" />
              Équipe
            </label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Sélectionner une équipe" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="">Toutes les équipes</SelectItem>
                {activeTeams.map((team) => (
                  <SelectItem key={team.id} value={team.name}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};