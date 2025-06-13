
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { TeamEvent } from '../types';
import EventCard from './EventCard';

interface DayAccordionItemProps {
  date: string;
  events: TeamEvent[];
}

const DayAccordionItem: React.FC<DayAccordionItemProps> = ({ date, events }) => {
  return (
    <AccordionItem value={date} className="border-b border-gray-100 last:border-b-0">
      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-gray-900">
                {format(new Date(date), "EEEE d MMMM", { locale: fr })}
              </span>
              <p className="text-sm text-gray-500 capitalize">
                {format(new Date(date), "EEEE", { locale: fr })}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {events.length} chantier{events.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DayAccordionItem;
