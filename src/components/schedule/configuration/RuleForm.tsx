
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Save } from 'lucide-react';
import { ProjectInfo } from '@/types/models';
import { SchedulingRule } from './types';
import { daysOfWeek, timeSlots } from './constants';

interface RuleFormProps {
  projectInfos: ProjectInfo[];
  selectedProject: string;
  currentRule: Partial<SchedulingRule>;
  onProjectChange: (projectId: string) => void;
  onRuleChange: (rule: Partial<SchedulingRule>) => void;
  onSaveRule: () => void;
  onTogglePreferredDay: (day: string) => void;
  onTogglePreferredTime: (time: string) => void;
}

const RuleForm: React.FC<RuleFormProps> = ({
  projectInfos,
  selectedProject,
  currentRule,
  onProjectChange,
  onRuleChange,
  onSaveRule,
  onTogglePreferredDay,
  onTogglePreferredTime,
}) => {
  return (
    <div className="space-y-6">
      {/* Sélection du projet */}
      <div className="space-y-2">
        <Label htmlFor="project">Chantier</Label>
        <Select value={selectedProject} onValueChange={onProjectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un chantier" />
          </SelectTrigger>
          <SelectContent>
            {projectInfos.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name} - {project.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Configuration de l'espacement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Type d'intervalle</Label>
          <Select 
            value={currentRule.intervalType} 
            onValueChange={(value) => onRuleChange({...currentRule, intervalType: value as any})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Jours</SelectItem>
              <SelectItem value="weeks">Semaines</SelectItem>
              <SelectItem value="months">Mois</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Valeur d'intervalle</Label>
          <Input
            type="number"
            min="1"
            value={currentRule.intervalValue || 1}
            onChange={(e) => onRuleChange({
              ...currentRule,
              intervalValue: parseInt(e.target.value) || 1
            })}
          />
        </div>

        <div className="space-y-2">
          <Label>Priorité</Label>
          <Select 
            value={currentRule.priority} 
            onValueChange={(value) => onRuleChange({...currentRule, priority: value as any})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Période de validité */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date de début (optionnel)</Label>
          <Input
            type="date"
            value={currentRule.startDate || ''}
            onChange={(e) => onRuleChange({
              ...currentRule,
              startDate: e.target.value
            })}
          />
        </div>
        <div className="space-y-2">
          <Label>Date de fin (optionnel)</Label>
          <Input
            type="date"
            value={currentRule.endDate || ''}
            onChange={(e) => onRuleChange({
              ...currentRule,
              endDate: e.target.value
            })}
          />
        </div>
      </div>

      {/* Jours préférés */}
      <div className="space-y-3">
        <Label>Jours préférés</Label>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((day) => (
            <Button
              key={day.value}
              variant={currentRule.preferredDays?.includes(day.value) ? "default" : "outline"}
              size="sm"
              onClick={() => onTogglePreferredDay(day.value)}
            >
              {day.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Créneaux horaires préférés */}
      <div className="space-y-3">
        <Label>Créneaux horaires préférés</Label>
        <div className="flex flex-wrap gap-2">
          {timeSlots.map((slot) => (
            <Button
              key={slot.value}
              variant={currentRule.preferredTimes?.includes(slot.value) ? "default" : "outline"}
              size="sm"
              onClick={() => onTogglePreferredTime(slot.value)}
            >
              <Clock className="h-4 w-4 mr-1" />
              {slot.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Options avancées */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="skip-weekends"
            checked={currentRule.skipWeekends || false}
            onCheckedChange={(checked) => onRuleChange({
              ...currentRule,
              skipWeekends: checked
            })}
          />
          <Label htmlFor="skip-weekends">Éviter les weekends</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="skip-holidays"
            checked={currentRule.skipHolidays || false}
            onCheckedChange={(checked) => onRuleChange({
              ...currentRule,
              skipHolidays: checked
            })}
          />
          <Label htmlFor="skip-holidays">Éviter les jours fériés</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="auto-adjust"
            checked={currentRule.autoAdjust || false}
            onCheckedChange={(checked) => onRuleChange({
              ...currentRule,
              autoAdjust: checked
            })}
          />
          <Label htmlFor="auto-adjust">Ajustement automatique en cas de conflit</Label>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>Consignes spéciales</Label>
        <Textarea
          placeholder="Ajoutez des consignes particulières pour ce chantier..."
          value={currentRule.notes || ''}
          onChange={(e) => onRuleChange({
            ...currentRule,
            notes: e.target.value
          })}
          className="min-h-20"
        />
      </div>

      <Button onClick={onSaveRule} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Sauvegarder la règle
      </Button>
    </div>
  );
};

export default RuleForm;
