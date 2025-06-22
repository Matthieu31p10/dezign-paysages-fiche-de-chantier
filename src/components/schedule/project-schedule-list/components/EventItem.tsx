
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventItemProps {
  event: {
    projectId: string;
    date: string;
    passageNumber: number;
    totalPassages: number;
    visitDuration: number;
    isLocked?: boolean;
  };
}

const EventItem: React.FC<EventItemProps> = React.memo(({ event }) => {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
        event.isLocked 
          ? 'bg-red-50 border-red-200' 
          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 ${event.isLocked ? 'text-red-600' : 'text-green-600'}`}>
          {event.isLocked && <Lock className="h-4 w-4" />}
          <Calendar className="h-4 w-4" />
          <span className="font-semibold">
            {format(new Date(event.date), "EEEE d MMMM yyyy", { locale: fr })}
          </span>
        </div>
        <Badge variant="secondary" className={event.isLocked ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'}>
          {event.isLocked ? 'Verrouillé' : `Passage ${event.passageNumber}/${event.totalPassages}`}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="h-4 w-4" />
        <span className="text-sm">{event.visitDuration}h</span>
      </div>
    </div>
  );
});

EventItem.displayName = 'EventItem';

export default EventItem;
