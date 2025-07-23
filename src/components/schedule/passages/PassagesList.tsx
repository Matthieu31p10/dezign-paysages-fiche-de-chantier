
import React from 'react';
import { useScheduledPassages } from './hooks/useScheduledPassages';
import PassagesTimeFilter from './components/PassagesTimeFilter';
import PassagesEmptyState from './components/PassagesEmptyState';
import PassagesGroup from './components/PassagesGroup';

interface PassagesListProps {
  selectedTeams: string[];
  showWeekends: boolean;
}

const PassagesList: React.FC<PassagesListProps> = ({ selectedTeams, showWeekends }) => {
  const { timeFilter, setTimeFilter, groupedEvents, getTeamInfo } = useScheduledPassages(
    selectedTeams,
    showWeekends
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Passages planifiés</h2>
          <p className="text-gray-600">Liste des chantiers à réaliser par ordre chronologique</p>
        </div>
        
        <PassagesTimeFilter
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />
      </div>

      {Object.keys(groupedEvents).length === 0 ? (
        <PassagesEmptyState />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([date, events]) => (
            <PassagesGroup
              key={date}
              date={date}
              events={events}
              getTeamInfo={getTeamInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PassagesList;
