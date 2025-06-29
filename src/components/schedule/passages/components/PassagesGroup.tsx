
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import PassageCard from './PassageCard';
import { getDateLabel, getDateBadgeVariant } from '../utils/dateUtils';

interface ScheduledEvent {
  id: string;
  projectName: string;
  address: string;
  visitDuration: number;
  passageNumber: number;
  totalPassages: number;
  teams: string[];
}

interface PassagesGroupProps {
  date: string;
  events: ScheduledEvent[];
  getTeamInfo: (teamId: string) => { id: string; name: string; color: string; } | undefined;
}

const PassagesGroup: React.FC<PassagesGroupProps> = ({ date, events, getTeamInfo }) => {
  return (
    <Card>
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
            <PassageCard
              key={event.id}
              event={event}
              getTeamInfo={getTeamInfo}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PassagesGroup;
