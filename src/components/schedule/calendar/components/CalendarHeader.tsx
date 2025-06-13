
import React from 'react';

interface CalendarHeaderProps {
  daysOfWeek: string[];
  showWeekends: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ daysOfWeek, showWeekends }) => {
  const getGridColumns = () => {
    return showWeekends ? 'grid-cols-7' : 'grid-cols-5';
  };

  return (
    <div className={`grid ${getGridColumns()} gap-0 border-b border-gray-200`}>
      {daysOfWeek.map((day, index) => (
        <div 
          key={day} 
          className={`text-center font-semibold py-4 text-sm border-r border-gray-200 last:border-r-0 ${
            showWeekends && index >= 5 ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-700'
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default CalendarHeader;
