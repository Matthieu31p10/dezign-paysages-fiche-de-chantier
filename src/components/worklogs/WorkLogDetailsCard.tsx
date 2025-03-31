
import { Calendar, Clock, User, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/utils/helpers';
import TimeTrackingSection from './TimeTrackingSection';

interface WorkLogDetailsCardProps {
  workLog: {
    date: Date;
    duration: number;
    personnel: string[];
    timeTracking: {
      departure: string;
      arrival: string;
      breakTime: string | number;
      totalHours: number;
    };
    waterConsumption?: number;
    notes?: string;
  };
  calculateHourDifference: () => string;
  calculateEndTime: () => string;
  notes: string;
  setNotes: (value: string) => void;
  saveNotes: () => void;
}

const WorkLogDetailsCard = ({ 
  workLog, 
  calculateHourDifference, 
  calculateEndTime,
  notes,
  setNotes,
  saveNotes
}: WorkLogDetailsCardProps) => {
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
            <h3 className="text-sm font-medium text-gray-500">Temps total</h3>
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              {workLog.timeTracking.totalHours.toFixed(2)} heures
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Écart du temps de passage</h3>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className={`font-medium ${
                calculateHourDifference().startsWith('+') ? 'text-red-600' : 'text-green-600'
              }`}>
                {calculateHourDifference()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Écart entre (heures effectuées / passages) et durée prévue
            </p>
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
        </div>
        
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
        
        <TimeTrackingSection 
          timeTracking={workLog.timeTracking}
          calculateEndTime={calculateEndTime}
        />
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Notes et observations</h3>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Ajoutez vos notes et observations ici..."
            rows={4}
          />
          <Button size="sm" onClick={saveNotes}>Enregistrer les notes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkLogDetailsCard;
