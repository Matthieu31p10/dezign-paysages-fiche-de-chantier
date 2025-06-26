
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCalendarData } from './calendar/hooks/useCalendarData';
import CalendarHeader from './calendar/components/CalendarHeader';
import CalendarGrid from './calendar/components/CalendarGrid';
import LockedDaysManager from './calendar/components/LockedDaysManager';
import ProjectLocksManager from './project-locks/components/ProjectLocksManager';
import OneTimeProjectsSidebar from './calendar/components/OneTimeProjectsSidebar';
import { useApp } from '@/context/AppContext';

interface LockedDay {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'maintenance' | 'holiday' | 'formation' | 'autre';
}

interface ScheduleCalendarProps {
  month: number;
  year: number;
  teamId: string;
  showWeekends?: boolean;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ month, year, teamId, showWeekends = true }) => {
  const [lockedDays, setLockedDays] = useState<LockedDay[]>([]);
  const { projectInfos } = useApp();
  
  const { daysOfWeek, days, startDayOfWeek, getEventsForDay } = useCalendarData(
    month, 
    year, 
    teamId, 
    showWeekends
  );
  
  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex justify-end gap-2">
          <ProjectLocksManager projects={projectInfos} />
          <LockedDaysManager
            month={month}
            year={year}
            lockedDays={lockedDays}
            onLockedDaysChange={setLockedDays}
          />
        </div>
        
        <Card className="overflow-hidden shadow-lg border-0 bg-white">
          <CardContent className="p-0">
            <CalendarHeader daysOfWeek={daysOfWeek} showWeekends={showWeekends} />
            <CalendarGrid 
              days={days}
              startDayOfWeek={startDayOfWeek}
              showWeekends={showWeekends}
              getEventsForDay={getEventsForDay}
              lockedDays={lockedDays}
            />
          </CardContent>
        </Card>
      </div>
      
      <OneTimeProjectsSidebar 
        projects={projectInfos}
        onAddProject={() => {
          // This could open a dialog to add a new one-time project
          console.log('Ajouter un nouveau chantier ponctuel');
        }}
      />
    </div>
  );
};

export default React.memo(ScheduleCalendar);
