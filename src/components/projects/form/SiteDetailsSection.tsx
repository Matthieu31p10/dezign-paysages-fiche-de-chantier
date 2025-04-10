
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeamsSelect } from '@/components/teams/TeamsSelect';

interface SiteDetailsSectionProps {
  irrigation: string;
  mowerType: string;
  team: string;
  onSelectChange: (name: string, value: string) => void;
}

const SiteDetailsSection: React.FC<SiteDetailsSectionProps> = ({
  irrigation,
  mowerType,
  team,
  onSelectChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="irrigation">Irrigation</Label>
        <Select
          value={irrigation}
          onValueChange={(value) => onSelectChange('irrigation', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune</SelectItem>
            <SelectItem value="irrigation">Irrigation</SelectItem>
            <SelectItem value="disabled">Désactivé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mowerType">Type de tondeuse</Label>
        <Select
          value={mowerType}
          onValueChange={(value) => onSelectChange('mowerType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="large">Grande</SelectItem>
            <SelectItem value="small">Petite</SelectItem>
            <SelectItem value="both">Les deux</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="team">Équipe</Label>
        <TeamsSelect
          value={team}
          onValueChange={(value) => onSelectChange('team', value)}
        />
      </div>
    </div>
  );
};

export default SiteDetailsSection;
