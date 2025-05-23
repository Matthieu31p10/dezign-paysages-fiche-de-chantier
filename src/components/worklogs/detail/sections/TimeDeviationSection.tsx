
import React from 'react';
import { Clock } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';

const TimeDeviationSection: React.FC = () => {
  const { workLog, calculateHourDifference } = useWorkLogDetail();

  // Vérifier si c'est une fiche vierge
  const isBlankWorksheet = workLog?.projectId && 
    (workLog.projectId.startsWith('blank-') || workLog.projectId.startsWith('DZFV'));

  if (isBlankWorksheet) {
    return null;
  }

  // Utiliser duration au lieu de plannedDuration qui n'existe pas
  const plannedHours = workLog?.duration || 0;
  const actualHours = workLog?.timeTracking?.totalHours || 0;
  const hourDifference = calculateHourDifference(plannedHours, actualHours);
  const isPositive = hourDifference > 0;
  const hourDifferenceText = isPositive ? `+${hourDifference}` : `${hourDifference}`;

  return (
    <div className="p-3 border rounded-md bg-gray-50">
      <h3 className="text-sm font-medium mb-2">Écart du temps de passage</h3>
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
        <span className={`font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {hourDifferenceText}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Durée prévue - (heures effectuées / nombre de passages)
      </p>
    </div>
  );
};

export default TimeDeviationSection;
