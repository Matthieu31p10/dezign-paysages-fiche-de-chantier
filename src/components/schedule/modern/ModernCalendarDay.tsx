
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';

interface ScheduledEvent {
  id: string;
  projectId: string;
  projectName: string;
  teams: string[];
  date: string;
  passageNumber: number;
  totalPassages: number;
  address: string;
  visitDuration: number;
}

interface ModernCalendarDayProps {
  date: Date;
  events: ScheduledEvent[];
}

const ModernCalendarDay: React.FC<ModernCalendarDayProps> = ({ date, events }) => {
  const { teams } = useApp();
  const dayNumber = format(date, 'd');
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const getTeamColor = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.color || '#6B7280';
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || 'Équipe inconnue';
  };

  return (
    <div className="border-r border-b bg-card hover:bg-muted transition-colors min-h-[120px] p-2 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-medium ${isToday ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs' : 'text-foreground'}`}>
          {dayNumber}
        </span>
        {events.length > 3 && (
          <Badge variant="secondary" className="text-xs">
            +{events.length - 2}
          </Badge>
        )}
      </div>
      
      <div className="space-y-1 flex-1">
        {events.slice(0, 3).map((event) => {
          const primaryTeamId = event.teams[0];
          const teamColor = getTeamColor(primaryTeamId);
          
          return (
            <div
              key={event.id}
              className="text-xs p-1.5 rounded border hover:shadow-sm transition-all cursor-pointer"
              style={{ 
                backgroundColor: `${teamColor}15`,
                borderColor: `${teamColor}40`
              }}
            >
              <div className="font-medium truncate mb-1">{event.projectName}</div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{event.visitDuration}h</span>
                <span className="text-gray-500 text-[10px]">{event.passageNumber}/{event.totalPassages}</span>
              </div>
              {event.teams.length > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {event.teams.slice(0, 2).map(teamId => (
                    <div
                      key={teamId}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getTeamColor(teamId) }}
                      title={getTeamName(teamId)}
                    />
                  ))}
                  {event.teams.length > 2 && (
                    <span className="text-[10px] text-gray-400">+{event.teams.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModernCalendarDay;
