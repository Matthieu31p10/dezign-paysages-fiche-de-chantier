
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useModernScheduleData } from '../modern/hooks/useModernScheduleData';
import { format, parseISO, isToday, isTomorrow, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PassagesListProps {
  selectedTeams: string[];
  showWeekends: boolean;
}

const PassagesList: React.FC<PassagesListProps> = ({ selectedTeams, showWeekends }) => {
  const { teams } = useApp();
  const [timeFilter, setTimeFilter] = useState<'today' | 'tomorrow' | 'week' | 'month'>('week');
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const { scheduledEvents } = useModernScheduleData({
    selectedMonth: currentMonth,
    selectedYear: currentYear,
    selectedTeams,
    showWeekends
  });

  const filteredEvents = useMemo(() => {
    const now = new Date();
    
    let filteredByTime = scheduledEvents.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        
        switch (timeFilter) {
          case 'today':
            return isToday(eventDate);
          case 'tomorrow':
            return isTomorrow(eventDate);
          case 'week':
            const weekStart = startOfWeek(now, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
            return eventDate >= weekStart && eventDate <= weekEnd;
          case 'month':
            return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      } catch (error) {
        console.error('Error parsing event date:', event.date, error);
        return false;
      }
    });

    // Trier par date puis par nom de projet
    return filteredByTime.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      return a.projectName.localeCompare(b.projectName);
    });
  }, [scheduledEvents, timeFilter]);

  const getTeamInfo = (teamId: string) => {
    return teams.find(team => team.id === teamId);
  };

  const getDateLabel = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return "Aujourd'hui";
      } else if (isTomorrow(date)) {
        return "Demain";
      } else {
        return format(date, 'EEEE d MMMM yyyy', { locale: fr });
      }
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString;
    }
  };

  const getDateBadgeVariant = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return "default" as const;
      } else if (isTomorrow(date)) {
        return "secondary" as const;
      } else {
        return "outline" as const;
      }
    } catch (error) {
      console.error('Error parsing date for badge:', dateString, error);
      return "outline" as const;
    }
  };

  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof filteredEvents> = {};
    
    filteredEvents.forEach(event => {
      if (!groups[event.date]) {
        groups[event.date] = [];
      }
      groups[event.date].push(event);
    });
    
    return groups;
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Passages planifiés</h2>
          <p className="text-gray-600">Liste des chantiers à réaliser par ordre chronologique</p>
        </div>
        
        <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="tomorrow">Demain</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {Object.keys(groupedEvents).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Aucun passage planifié</h3>
            <p className="text-gray-600">
              Aucun passage n'est planifié pour la période sélectionnée.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([date, events]) => (
            <Card key={date}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    {getDateLabel(date)}
                  </CardTitle>
                  <Badge variant={getDateBadgeVariant(date)}>
                    {events.length} passage{events.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{event.projectName}</h4>
                          <Badge variant="outline" className="text-xs">
                            Passage {event.passageNumber}/{event.totalPassages}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.address}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.visitDuration}h</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <div className="flex gap-1">
                              {event.teams.map(teamId => {
                                const team = getTeamInfo(teamId);
                                return team ? (
                                  <Badge
                                    key={teamId}
                                    variant="secondary"
                                    className="text-xs"
                                    style={{ backgroundColor: team.color + '20', color: team.color }}
                                  >
                                    {team.name}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassagesList;
