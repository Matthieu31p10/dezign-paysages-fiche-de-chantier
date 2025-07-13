
import React from 'react';
import { Badge } from '@/components/ui/badge';
import TeamBadge from '@/components/ui/team-badge';
import { Clock, MapPin } from 'lucide-react';
import { TeamEvent } from '../types';
import { useApp } from '@/context/AppContext';

interface EventCardProps {
  event: TeamEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { teams } = useApp();
  const team = teams.find(t => t.id === event.team);
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow"
         style={{ borderLeftColor: team?.color || '#10B981', borderLeftWidth: '4px' }}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="bg-primary text-primary-foreground border-primary font-bold text-xs">
              #{event.passageNumber}/{event.totalPassages}
            </Badge>
            <h4 className="font-bold text-green-800 text-lg">{event.projectName}</h4>
            {team && <TeamBadge teamName={team.name} teamColor={team.color} size="sm" />}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <p className="text-sm">{event.address}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{event.duration}h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
