
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
    });
  };

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

      {selectedProject && selectedDay && (
        <Alert className="border-orange-200 bg-orange-50">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Impact du verrouillage :</strong><br />
            Tous les passages du chantier "<strong>{selectedProject.name}</strong>" 
            seront bloqués pour tous les <strong>{selectedDay.label.toLowerCase()}s</strong> de l'année.
            <br />
            <em>Cela concerne tous les passages programmés ({selectedProject.annualVisits || 12} passages/an).</em>
          </AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="reason">Motif du verrouillage</Label>
        <Input
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Ex: Maintenance, Fermeture client, Congés du client..."
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
          Verrouiller tous les passages
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default ProjectLockForm;
