
import React from 'react';
import { Calendar, Clock, User, Euro } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { useWorkLogDetail } from '../WorkLogDetailContext';

const BasicInfoSection: React.FC = () => {
  const { workLog, calculateTotalTeamHours } = useWorkLogDetail();
  
  // Vérifier si c'est une fiche vierge
  const isBlankWorksheet = workLog.projectId && (workLog.projectId.startsWith('blank-') || workLog.projectId.startsWith('DZFV'));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Date</h3>
          <p className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            {formatDate(workLog.date)}
          </p>
        </div>
        
        {!isBlankWorksheet && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Durée prévue</h3>
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              {workLog.duration} heures
            </p>
          </div>
        )}
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Temps total (équipe)</h3>
          <p className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
            {calculateTotalTeamHours()} heures
          </p>
        </div>
        
        {workLog.hourlyRate > 0 && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Taux horaire</h3>
            <p className="flex items-center">
              <Euro className="w-4 h-4 mr-2 text-muted-foreground" />
              {workLog.hourlyRate} €/h
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;
