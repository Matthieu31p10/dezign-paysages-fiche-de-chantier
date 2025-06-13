
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProjectInfo } from '@/types/models';
import { weekDays } from '../constants';

interface RuleFormProps {
  projects: ProjectInfo[];
  selectedProject: string;
  fixedDays: Record<string, boolean>;
  distributionStrategy: 'even' | 'start' | 'end';
  maxConsecutiveDays: number;
  onProjectSelect: (projectId: string) => void;
  onFixedDayChange: (day: string, checked: boolean) => void;
  onDistributionStrategyChange: (strategy: 'even' | 'start' | 'end') => void;
  onMaxConsecutiveDaysChange: (days: number) => void;
  onAddRule: () => void;
  hasExistingRule: boolean;
}

const RuleForm: React.FC<RuleFormProps> = ({
  projects,
  selectedProject,
  fixedDays,
  distributionStrategy,
  maxConsecutiveDays,
  onProjectSelect,
  onFixedDayChange,
  onDistributionStrategyChange,
  onMaxConsecutiveDaysChange,
  onAddRule,
  hasExistingRule,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project">Chantier</Label>
        <Select value={selectedProject} onValueChange={onProjectSelect}>
          <SelectTrigger id="project">
            <SelectValue placeholder="Sélectionner un chantier" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Jours fixes</Label>
        <div className="grid grid-cols-2 gap-2">
          {weekDays.map((day) => (
            <div key={day.id} className="flex items-center space-x-2">
              <Checkbox 
                id={day.id} 
                checked={fixedDays[day.id] || false}
                onCheckedChange={(checked) => 
                  onFixedDayChange(day.id, checked === true)
                }
              />
              <Label htmlFor={day.id}>{day.label}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="distribution">Stratégie de distribution</Label>
        <Select value={distributionStrategy} onValueChange={onDistributionStrategyChange}>
          <SelectTrigger id="distribution">
            <SelectValue placeholder="Sélectionner une stratégie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="even">Répartition uniforme</SelectItem>
            <SelectItem value="start">Début de mois</SelectItem>
            <SelectItem value="end">Fin de mois</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="maxConsecutiveDays">Max. jours consécutifs</Label>
        <Input 
          id="maxConsecutiveDays" 
          type="number" 
          min="1" 
          max="7" 
          value={maxConsecutiveDays}
          onChange={(e) => onMaxConsecutiveDaysChange(Number(e.target.value))}
        />
      </div>
      
      <Button onClick={onAddRule} className="w-full">
        {hasExistingRule ? "Mettre à jour la règle" : "Ajouter la règle"}
      </Button>
    </div>
  );
};

export default RuleForm;
