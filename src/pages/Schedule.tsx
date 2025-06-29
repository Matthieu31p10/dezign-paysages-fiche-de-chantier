
import React from 'react';
import ScheduleHeader from '@/components/schedule/ScheduleHeader';
import ModernSchedule from '@/components/schedule/modern/ModernSchedule';

const Schedule = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <ScheduleHeader />
      <ModernSchedule />
    </div>
  );
};

export default Schedule;
