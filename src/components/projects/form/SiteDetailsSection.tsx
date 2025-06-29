
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTeams } from '@/context/TeamsContext';

interface SiteDetailsSectionProps {
  irrigation?: string;
  mowerType?: string;
  team: string;
  onSelectChange: (field: string, value: string) => void;
}

const SiteDetailsSection: React.FC<SiteDetailsSectionProps> = ({
  irrigation,
  mowerType,
  team,
  onSelectChange
}) => {
  const { teams } = useTeams();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Arrosage</Label>
        <Select value={irrigation || ''} onValueChange={(value) => onSelectChange('irrigation', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Type d'arrosage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="irrigation">Irrigation</SelectItem>
            <SelectItem value="none">Aucun</SelectItem>
            <SelectItem value="disabled">Désactivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Type de tondeuse</Label>
        <Select value={mowerType || ''} onValueChange={(value) => onSelectChange('mowerType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Type de tondeuse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="large">Grande</SelectItem>
            <SelectItem value="small">Petite</SelectItem>
            <SelectItem value="both">Les deux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Équipe principale (compatibilité)</Label>
        <Select value={team} onValueChange={(value) => onSelectChange('team', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une équipe" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((teamOption) => (
              <SelectItem key={teamOption.id} value={teamOption.id}>
                {teamOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SiteDetailsSection;
