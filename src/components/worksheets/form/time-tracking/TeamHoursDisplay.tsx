
import { FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TeamHoursDisplayProps {
  totalTeamHours: number;
  personnelCount: number;
}

export const TeamHoursDisplay = ({ totalTeamHours, personnelCount }: TeamHoursDisplayProps) => {
  // S'assurer que totalTeamHours est bien un nombre
  const hoursValue = typeof totalTeamHours === 'number' 
    ? totalTeamHours.toFixed(2) 
    : '0.00';

  return (
    <div className="space-y-1 mb-1">
      <FormLabel className="text-sm">Total équipe ({personnelCount} pers.)</FormLabel>
      <Input 
        type="number" 
        readOnly
        value={hoursValue}
        className="bg-muted h-9"
      />
      <FormMessage />
    </div>
  );
};
