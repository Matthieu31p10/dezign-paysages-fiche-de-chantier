
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Droplets, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { useWorkLogDetail } from './WorkLogDetailContext';
import NotesSection from './NotesSection';

const WorkLogDetails: React.FC = () => {
  const { workLog, calculateEndTime, calculateHourDifference, calculateTotalTeamHours } = useWorkLogDetail();
  
  // Fonction pour convertir le code de gestion des déchets en texte lisible
  const getWasteManagementText = (wasteCode?: string) => {
    switch (wasteCode) {
      case 'one_big_bag': return '1 Big-bag';
      case 'two_big_bags': return '2 Big-bags';
      case 'half_dumpster': return '1/2 Benne';
      case 'one_dumpster': return '1 Benne';
      case 'none': 
      default: return 'Aucun';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Détails du passage</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Date</h3>
            <p className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              {formatDate(workLog.date)}
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Durée prévue</h3>
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              {workLog.duration} heures
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Temps total (équipe)</h3>
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              {calculateTotalTeamHours()} heures
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Écart du temps de passage</h3>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className={`font-medium ${
                calculateHourDifference().startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateHourDifference()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Durée prévue - (heures effectuées / nombre de passages)
            </p>
          </div>
          
          <div className="p-3 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Gestion des déchets</h3>
            <div className="flex items-center">
              <Trash2 className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium">
                {getWasteManagementText(workLog.wasteManagement)}
              </span>
            </div>
          </div>
        </div>
        
        {workLog.waterConsumption !== undefined && (
          <div className="p-3 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Consommation d'eau</h3>
            <div className="flex items-center">
              <Droplets className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">{workLog.waterConsumption} m³</span>
            </div>
          </div>
        )}
        
        <Separator />
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500">Personnel présent</h3>
          <div className="space-y-1">
            {workLog.personnel.map((person, index) => (
              <p key={index} className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                {person}
              </p>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500">Suivi du temps</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Départ</p>
              <p>{workLog.timeTracking.departure}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Arrivée</p>
              <p>{workLog.timeTracking.arrival}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Heure de fin</p>
              <p>{workLog.timeTracking.end || calculateEndTime()}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Pause</p>
              <p>{workLog.timeTracking.breakTime} heures</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <NotesSection />
      </CardContent>
    </Card>
  );
};

export default WorkLogDetails;
