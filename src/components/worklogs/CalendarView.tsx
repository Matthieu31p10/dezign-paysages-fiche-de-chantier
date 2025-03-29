
import { useState } from 'react';
import { WorkLog } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/helpers';
import { Calendar as CalendarIcon, ArrowRight, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CalendarViewProps {
  workLogs: WorkLog[];
}

const CalendarView = ({ workLogs }: CalendarViewProps) => {
  const navigate = useNavigate();
  const { getProjectById } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Group work logs by date
  const workLogsByDate = workLogs.reduce<Record<string, WorkLog[]>>((acc, log) => {
    const dateKey = formatDateKey(log.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {});
  
  // Get dates with work logs
  const datesWithWorkLogs = new Set(
    workLogs.map(log => formatDateKey(log.date))
  );
  
  // Function to highlight dates with work logs
  const isDayWithWorkLog = (date: Date) => {
    return datesWithWorkLogs.has(formatDateKey(date));
  };
  
  // Get work logs for selected date
  const getWorkLogsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateKey = formatDateKey(selectedDate);
    return workLogsByDate[dateKey] || [];
  };
  
  const selectedDateWorkLogs = getWorkLogsForSelectedDate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Calendrier des passages
        </CardTitle>
        <CardDescription>
          Visualisez vos passages de chantier sur un calendrier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border rounded-md p-3"
            modifiers={{
              withWorkLog: (date) => isDayWithWorkLog(date),
            }}
            modifiersClassNames={{
              withWorkLog: "bg-blue-50 font-bold text-primary",
            }}
            defaultMonth={selectedDate}
          />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              {selectedDate 
                ? `Passages du ${formatDate(selectedDate)}` 
                : 'Sélectionnez une date'
              }
            </h3>
            
            {selectedDateWorkLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Aucun passage pour cette date
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDateWorkLogs.map(workLog => {
                  const project = getProjectById(workLog.projectId);
                  return (
                    <div 
                      key={workLog.id} 
                      className="flex items-center justify-between border rounded-md p-2 text-sm hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/worklogs/${workLog.id}`)}
                    >
                      <div>
                        <span className="font-medium">{project?.name || 'Chantier inconnu'}</span>
                        <div className="flex items-center text-muted-foreground mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {workLog.timeTracking.totalHours.toFixed(1)} heures
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;

// Helper function to format date as YYYY-MM-DD for comparison
const formatDateKey = (date: Date): string => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
};
