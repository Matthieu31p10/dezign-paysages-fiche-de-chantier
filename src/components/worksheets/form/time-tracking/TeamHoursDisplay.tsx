
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface TeamHoursDisplayProps {
  totalTeamHours: number;
  personnelCount: number;
}

export const TeamHoursDisplay = ({ totalTeamHours, personnelCount }: TeamHoursDisplayProps) => {
  return (
    <Card className="p-3 border rounded-md bg-gradient-to-r from-green-50 to-white border-green-200">
      <Label className="text-sm text-green-700">Heures équipe totales</Label>
      <div className="text-xl font-bold text-green-800">
        {Number(totalTeamHours).toFixed(2)}h
      </div>
      <div className="text-xs text-green-600">
        Pour {personnelCount} {personnelCount > 1 ? 'personnes' : 'personne'}
      </div>
    </Card>
  );
};
