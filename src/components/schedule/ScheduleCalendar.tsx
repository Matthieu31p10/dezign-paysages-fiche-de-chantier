
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCalendarData } from './calendar/hooks/useCalendarData';
import CalendarHeader from './calendar/components/CalendarHeader';
import CalendarGrid from './calendar/components/CalendarGrid';

interface ScheduleCalendarProps {
  month: number;
  year: number;
  teamId: string;
  showWeekends?: boolean;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ month, year, teamId, showWeekends = true }) => {
  const { daysOfWeek, days, startDayOfWeek, getEventsForDay } = useCalendarData(
    month, 
    year, 
    teamId, 
    showWeekends
  );
  
  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-white">
      <CardContent className="p-0">
        <CalendarHeader daysOfWeek={daysOfWeek} showWeekends={showWeekends} />
        <CalendarGrid 
          days={days}
          startDayOfWeek={startDayOfWeek}
          showWeekends={showWeekends}
          getEventsForDay={getEventsForDay}
        />
      </CardContent>
    </Card>
  );
};

export default React.memo(ScheduleCalendar);
