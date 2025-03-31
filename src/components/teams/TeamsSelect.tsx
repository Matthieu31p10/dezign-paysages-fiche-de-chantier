
import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface TeamsSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TeamsSelect = ({ value, onValueChange }: TeamsSelectProps) => {
  const { teams } = useApp();
  
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner une équipe" />
      </SelectTrigger>
      <SelectContent>
        {teams.length > 0 ? (
          teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="" disabled>
            Aucune équipe disponible
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};
