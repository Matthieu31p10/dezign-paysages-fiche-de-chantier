import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Users, Clock } from 'lucide-react';
import { WorkLog } from '@/types/models';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PassageCalendarProps {
  passages: WorkLog[];
  getProjectName: (projectId: string) => string;
  onPassageClick?: (passage: WorkLog) => void;
}

interface DayPassages {
  date: Date;
  passages: WorkLog[];
  hasPassages: boolean;
}

export const PassageCalendar: React.FC<PassageCalendarProps> = ({
  passages,
  getProjectName,
  onPassageClick
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const dayPassages: DayPassages[] = days.map(date => {
      const dayPassages = passages.filter(passage => 
        isSameDay(new Date(passage.date), date)
      );
      
      return {
        date,
        passages: dayPassages,
        hasPassages: dayPassages.length > 0
      };
    });

    return dayPassages;
  }, [passages, currentMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const getDayIntensity = (passageCount: number) => {
    if (passageCount === 0) return '';
    if (passageCount === 1) return 'bg-blue-100 border-blue-200 dark:bg-blue-900 dark:border-blue-700';
    if (passageCount === 2) return 'bg-blue-200 border-blue-300 dark:bg-blue-800 dark:border-blue-600';
    return 'bg-blue-300 border-blue-400 dark:bg-blue-700 dark:border-blue-500';
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <Card className="bg-background border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Vue calendrier
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-32 text-center font-medium">
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
        </CardTitle>
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
                relative min-h-20 p-1 border rounded-lg transition-colors
                ${getDayIntensity(day.passages.length)}
                ${day.hasPassages ? 'cursor-pointer hover:ring-2 hover:ring-blue-300' : 'bg-muted/20'}
              `}
            >
              {/* Numéro du jour */}
              <div className="text-xs font-medium mb-1">
                {format(day.date, 'd')}
              </div>

              {/* Passages du jour */}
              {day.passages.length > 0 && (
                <div className="space-y-1">
                  {day.passages.slice(0, 2).map((passage, pIndex) => (
                    <div
                      key={passage.id}
                      onClick={() => onPassageClick?.(passage)}
                      className="text-xs p-1 bg-background/80 rounded border truncate hover:bg-background transition-colors"
                      title={`${getProjectName(passage.projectId)} - ${passage.personnel?.[0] || 'N/A'}`}
                    >
                      <div className="flex items-center gap-1">
                        <MapPin className="h-2 w-2 flex-shrink-0" />
                        <span className="truncate">
                          {getProjectName(passage.projectId)}
                        </span>
                      </div>
                      {passage.personnel?.[0] && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Users className="h-2 w-2 flex-shrink-0" />
                          <span className="truncate text-muted-foreground">
                            {passage.personnel[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Indicateur s'il y a plus de passages */}
                  {day.passages.length > 2 && (
                    <div className="text-xs text-center text-muted-foreground bg-background/60 rounded px-1">
                      +{day.passages.length - 2} autres
                    </div>
                  )}
                </div>
              )}

              {/* Badge du nombre de passages */}
              {day.passages.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-1 right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                >
                  {day.passages.length}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted/20 border rounded"></div>
            <span className="text-xs text-muted-foreground">Aucun passage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border-blue-200 rounded dark:bg-blue-900 dark:border-blue-700"></div>
            <span className="text-xs text-muted-foreground">1 passage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 border-blue-300 rounded dark:bg-blue-800 dark:border-blue-600"></div>
            <span className="text-xs text-muted-foreground">2 passages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-300 border-blue-400 rounded dark:bg-blue-700 dark:border-blue-500"></div>
            <span className="text-xs text-muted-foreground">3+ passages</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};