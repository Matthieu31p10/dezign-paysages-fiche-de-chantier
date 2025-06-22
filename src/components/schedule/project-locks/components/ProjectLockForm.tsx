
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { ProjectInfo } from '@/types/models';
import { ProjectLockFormData } from '../types';
import { DAYS_OF_WEEK } from '../constants';

interface ProjectLockFormProps {
  projects: ProjectInfo[];
  onSubmit: (formData: ProjectLockFormData) => void;
  onCancel: () => void;
}

const ProjectLockForm: React.FC<ProjectLockFormProps> = ({
  projects,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProjectLockFormData>({
    projectId: '',
    dayOfWeek: 1,
    reason: '',
    description: '',
    minDaysBetweenVisits: undefined,
  });

  const selectedProject = projects.find(p => p.id === formData.projectId);
  const selectedDay = DAYS_OF_WEEK.find(d => d.value === formData.dayOfWeek);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId || !formData.reason) {
      return;
    }
    onSubmit(formData);
    setFormData({
      projectId: '',
      dayOfWeek: 1,
      reason: '',
      description: '',
      minDaysBetweenVisits: undefined,
    });
  };

  const isCompleteBlock = !formData.minDaysBetweenVisits || formData.minDaysBetweenVisits === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="project">Chantier</Label>
        <Select 
          value={formData.projectId} 
          onValueChange={(value) => setFormData({ ...formData, projectId: value })}
        >
          <SelectTrigger>
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

      <div>
        <Label htmlFor="dayOfWeek">Jour de la semaine</Label>
        <Select 
          value={formData.dayOfWeek.toString()} 
          onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OF_WEEK.map((day) => (
              <SelectItem key={day.value} value={day.value.toString()}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="minDaysBetweenVisits">Délai minimum entre passages (jours)</Label>
        <Input
          id="minDaysBetweenVisits"
          type="number"
          min="0"
          value={formData.minDaysBetweenVisits || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            minDaysBetweenVisits: e.target.value ? parseInt(e.target.value) : undefined 
          })}
          placeholder="Laisser vide pour bloquer complètement"
        />
        <p className="text-sm text-gray-600 mt-1">
          Laisser vide ou 0 pour bloquer complètement tous les passages ce jour-là.
          Sinon, définir le nombre minimum de jours entre chaque passage.
        </p>
      </div>

      {selectedProject && selectedDay && (
        <Alert className={isCompleteBlock ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}>
          <Info className={`h-4 w-4 ${isCompleteBlock ? "text-red-600" : "text-orange-600"}`} />
          <AlertDescription className={isCompleteBlock ? "text-red-800" : "text-orange-800"}>
            <strong>Impact du verrouillage :</strong><br />
            {isCompleteBlock ? (
              <>
                Tous les passages du chantier "<strong>{selectedProject.name}</strong>" 
                seront bloqués pour tous les <strong>{selectedDay.label.toLowerCase()}s</strong> de l'année.
              </>
            ) : (
              <>
                Les passages du chantier "<strong>{selectedProject.name}</strong>" 
                les <strong>{selectedDay.label.toLowerCase()}s</strong> seront espacés d'au minimum{' '}
                <strong>{formData.minDaysBetweenVisits} jour{formData.minDaysBetweenVisits > 1 ? 's' : ''}</strong>.
              </>
            )}
            <br />
            <em>Cela concerne la planification automatique des {selectedProject.annualVisits || 12} passages/an.</em>
          </AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="reason">Motif du verrouillage</Label>
        <Input
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Ex: Espacement des passages, Maintenance, Congés du client..."
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (optionnel)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Détails supplémentaires sur la consigne..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
          {isCompleteBlock ? 'Verrouiller complètement' : 'Appliquer le délai'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default ProjectLockForm;
