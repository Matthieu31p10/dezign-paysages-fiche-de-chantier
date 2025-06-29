
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';

interface ScheduledEvent {
  id: string;
  projectName: string;
  address: string;
  visitDuration: number;
  passageNumber: number;
  totalPassages: number;
  teams: string[];
}

interface PassageCardProps {
  event: ScheduledEvent;
  getTeamInfo: (teamId: string) => { id: string; name: string; color: string; } | undefined;
}

const PassageCard: React.FC<PassageCardProps> = ({ event, getTeamInfo }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
  );
};

export default PassageCard;
