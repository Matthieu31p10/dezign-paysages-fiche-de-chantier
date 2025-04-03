
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentYear } from '@/utils/helpers';

interface WorkLogsFilterProps {
  projects: any[];
  teams: any[];
  selectedProjectId: string | 'all';
  selectedTeamId: string | 'all';
  selectedMonth: number | 'all';
  selectedYear: number;
  onProjectChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  onMonthChange: (value: number | 'all') => void;
  onYearChange: (value: number) => void;
}

export const WorkLogsFilter = ({
  projects,
  teams,
  selectedProjectId,
  selectedTeamId,
  selectedMonth,
  selectedYear,
  onProjectChange,
  onTeamChange,
  onMonthChange,
  onYearChange
}: WorkLogsFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="w-full md:w-64">
        <label className="text-sm font-medium block mb-2">Filtrer par chantier</label>
        <Select
          value={selectedProjectId}
          onValueChange={onProjectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les chantiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les chantiers</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-64">
        <label className="text-sm font-medium block mb-2">Filtrer par équipe</label>
        <Select
          value={selectedTeamId}
          onValueChange={onTeamChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les équipes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-64">
        <label className="text-sm font-medium block mb-2">Année</label>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => onYearChange(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une année" />
          </SelectTrigger>
          <SelectContent>
            {/* Current year as fallback */}
            <SelectItem value={getCurrentYear().toString()}>
              {getCurrentYear().toString()}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-64">
        <label className="text-sm font-medium block mb-2">Mois</label>
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => onMonthChange(value === 'all' ? 'all' : Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les mois" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les mois</SelectItem>
            <SelectItem value="1">Janvier</SelectItem>
            <SelectItem value="2">Février</SelectItem>
            <SelectItem value="3">Mars</SelectItem>
            <SelectItem value="4">Avril</SelectItem>
            <SelectItem value="5">Mai</SelectItem>
            <SelectItem value="6">Juin</SelectItem>
            <SelectItem value="7">Juillet</SelectItem>
            <SelectItem value="8">Août</SelectItem>
            <SelectItem value="9">Septembre</SelectItem>
            <SelectItem value="10">Octobre</SelectItem>
            <SelectItem value="11">Novembre</SelectItem>
            <SelectItem value="12">Décembre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
