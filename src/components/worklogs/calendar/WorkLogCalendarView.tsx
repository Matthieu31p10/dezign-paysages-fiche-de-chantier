import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Users, Clock } from 'lucide-react';
import { WorkLog } from '@/types/models';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WorkLogCalendarViewProps {
  workLogs: WorkLog[];
  getProjectName: (projectId: string) => string;
  onWorkLogClick?: (workLog: WorkLog) => void;
}

export const WorkLogCalendarView: React.FC<WorkLogCalendarViewProps> = ({
  workLogs,
  getProjectName,
  onWorkLogClick
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarData = React.useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map(date => {
      const dayLogs = workLogs.filter(log => 
        isSameDay(new Date(log.date), date)
      );
      
      const totalHours = dayLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        return sum + (hours * personnel);
      }, 0);

      const totalAmount = dayLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || log.duration || 0;
        const personnel = log.personnel?.length || 1;
        const rate = log.hourlyRate || 0;
        return sum + (hours * personnel * rate);
      }, 0);

      return {
        date,
        logs: dayLogs,
        totalHours,
        totalAmount,
        hasLogs: dayLogs.length > 0
      };
    });
  }, [workLogs, currentMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const getDayIntensity = (logCount: number, totalHours: number) => {
    if (logCount === 0) return 'bg-gray-50 dark:bg-gray-900';
    if (logCount === 1) return 'bg-blue-100 dark:bg-blue-900';
    if (logCount <= 3) return 'bg-blue-200 dark:bg-blue-800';
    return 'bg-blue-300 dark:bg-blue-700';
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Calculs pour le mois
  const monthStats = React.useMemo(() => {
    const monthLogs = workLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === currentMonth.getMonth() && 
             logDate.getFullYear() === currentMonth.getFullYear();
    });

    const totalHours = monthLogs.reduce((sum, log) => {
      const hours = log.timeTracking?.totalHours || log.duration || 0;
      const personnel = log.personnel?.length || 1;
      return sum + (hours * personnel);
    }, 0);

    const totalAmount = monthLogs.reduce((sum, log) => {
      const hours = log.timeTracking?.totalHours || log.duration || 0;
      const personnel = log.personnel?.length || 1;
      const rate = log.hourlyRate || 0;
      return sum + (hours * personnel * rate);
    }, 0);

    const invoicedCount = monthLogs.filter(log => log.invoiced).length;

    return {
      totalLogs: monthLogs.length,
      totalHours: totalHours.toFixed(1),
      totalAmount: totalAmount.toFixed(0),
      invoicedCount,
      invoicingRate: monthLogs.length > 0 ? ((invoicedCount / monthLogs.length) * 100).toFixed(0) : 0
    };
  }, [workLogs, currentMonth]);

  return (
    <Card className="bg-background border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Vue Calendrier
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-40 text-center font-medium">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Statistiques du mois */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{monthStats.totalLogs}</div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Fiches</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="text-lg font-bold text-green-600">{monthStats.totalHours}h</div>
            <div className="text-xs text-green-700 dark:text-green-300">Heures</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{monthStats.totalAmount}€</div>
            <div className="text-xs text-purple-700 dark:text-purple-300">Revenus</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{monthStats.invoicingRate}%</div>
            <div className="text-xs text-orange-700 dark:text-orange-300">Facturé</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* En-têtes des jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-xs font-medium text-center text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => (
            <div
              key={index}
              className={`
                relative min-h-24 p-2 border rounded-lg transition-all cursor-pointer
                ${getDayIntensity(day.logs.length, day.totalHours)}
                ${day.hasLogs ? 'hover:ring-2 hover:ring-blue-300 hover:shadow-md' : ''}
                ${isToday(day.date) ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              {/* Numéro du jour */}
              <div className={`text-sm font-medium mb-1 ${isToday(day.date) ? 'text-blue-600 font-bold' : ''}`}>
                {format(day.date, 'd')}
              </div>

              {/* Fiches du jour */}
              {day.logs.length > 0 && (
                <div className="space-y-1">
                  {day.logs.slice(0, 2).map((log, logIndex) => (
                    <div
                      key={log.id}
                      onClick={() => onWorkLogClick?.(log)}
                      className="text-xs p-1 bg-white/90 dark:bg-gray-800/90 rounded border truncate hover:bg-white dark:hover:bg-gray-800 transition-colors"
                      title={`${getProjectName(log.projectId)} - ${log.personnel?.[0] || 'N/A'}`}
                    >
                      <div className="flex items-center gap-1">
                        <MapPin className="h-2 w-2 flex-shrink-0 text-blue-500" />
                        <span className="truncate font-medium">
                          {getProjectName(log.projectId)}
                        </span>
                      </div>
                      {log.personnel?.[0] && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Users className="h-2 w-2 flex-shrink-0 text-gray-500" />
                          <span className="truncate text-gray-600 dark:text-gray-400">
                            {log.personnel[0]}
                          </span>
                        </div>
                      )}
                      {(log.timeTracking?.totalHours || log.duration) && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-2 w-2 flex-shrink-0 text-green-500" />
                          <span className="text-green-600 dark:text-green-400">
                            {(log.timeTracking?.totalHours || log.duration)}h
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Indicateur s'il y a plus de fiches */}
                  {day.logs.length > 2 && (
                    <div className="text-xs text-center text-muted-foreground bg-white/60 dark:bg-gray-800/60 rounded px-1">
                      +{day.logs.length - 2} autres
                    </div>
                  )}
                </div>
              )}

              {/* Badge du nombre de fiches */}
              {day.logs.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-1 right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-blue-500 text-white"
                >
                  {day.logs.length}
                </Badge>
              )}

              {/* Indicateur pour aujourd'hui */}
              {isToday(day.date) && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-50 dark:bg-gray-900 border rounded"></div>
            <span className="text-xs text-muted-foreground">Aucune fiche</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900 border rounded"></div>
            <span className="text-xs text-muted-foreground">1 fiche</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 border rounded"></div>
            <span className="text-xs text-muted-foreground">2-3 fiches</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-300 dark:bg-blue-700 border rounded"></div>
            <span className="text-xs text-muted-foreground">4+ fiches</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};