
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SchedulingSectionProps {
  annualVisits: number;
  annualTotalHours: number;
  visitDuration: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SchedulingSection: React.FC<SchedulingSectionProps> = ({
  annualVisits,
  annualTotalHours,
  visitDuration,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="annualVisits">Nombre de visites annuelles</Label>
        <Input
          id="annualVisits"
          name="annualVisits"
          type="number"
          min="0"
          value={annualVisits}
          onChange={onInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="annualTotalHours">Nombre total d'heures annuelles</Label>
        <Input
          id="annualTotalHours"
          name="annualTotalHours"
          type="number"
          min="0"
          step="0.5"
          value={annualTotalHours}
          onChange={onInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="visitDuration">Durée d'une visite (heures)</Label>
        <Input
          id="visitDuration"
          name="visitDuration"
          type="number"
          min="0"
          step="0.5"
          value={visitDuration}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default SchedulingSection;
