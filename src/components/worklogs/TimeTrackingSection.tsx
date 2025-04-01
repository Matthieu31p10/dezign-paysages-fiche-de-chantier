
import { Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface TimeTrackingSectionProps {
  timeTracking: {
    departure: string;
    arrival: string;
    breakTime: string | number;
  };
  calculateEndTime?: () => string;
}

const TimeTrackingSection = ({ timeTracking, calculateEndTime }: TimeTrackingSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500">Suivi du temps</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Départ</p>
          <p>{timeTracking.departure}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Arrivée</p>
          <p>{timeTracking.arrival}</p>
        </div>
        
        {calculateEndTime && (
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Heure de fin</p>
            <p>{calculateEndTime()}</p>
          </div>
        )}
        
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Pause</p>
          <p>{timeTracking.breakTime} heures</p>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingSection;
