
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { TeamEvent } from '../types';
import DayAccordionItem from './DayAccordionItem';
import EmptyTeamState from './EmptyTeamState';

interface TeamCardProps {
  team: { id: string; name: string };
  events: Record<string, TeamEvent[]>;
  monthName: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, events, monthName }) => {
  const totalEvents = Object.values(events).reduce((sum, dayEvents) => sum + dayEvents.length, 0);
  
  const eventsWithData = Object.entries(events)
    .filter(([_, dayEvents]) => dayEvents.length > 0)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));

  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 via-green-25 to-white border-b border-green-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
              <p className="text-sm text-gray-600 font-normal">Équipe de terrain</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 font-semibold">
            {totalEvents} passage{totalEvents !== 1 ? 's' : ''} • {monthName}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {eventsWithData.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {eventsWithData.map(([date, dayEvents]) => (
              <DayAccordionItem key={date} date={date} events={dayEvents} />
            ))}
          </Accordion>
        ) : (
          <EmptyTeamState 
            title="Aucun passage programmé"
            description="Aucun passage n'est programmé pour cette équipe ce mois-ci."
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TeamCard;
