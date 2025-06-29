
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PassagesTimeFilterProps {
  timeFilter: 'today' | 'tomorrow' | 'week' | 'month';
  onTimeFilterChange: (value: 'today' | 'tomorrow' | 'week' | 'month') => void;
}

const PassagesTimeFilter: React.FC<PassagesTimeFilterProps> = ({
  timeFilter,
  onTimeFilterChange
}) => {
  return (
    <Select value={timeFilter} onValueChange={onTimeFilterChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filtrer par période" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">Aujourd'hui</SelectItem>
        <SelectItem value="tomorrow">Demain</SelectItem>
        <SelectItem value="week">Cette semaine</SelectItem>
        <SelectItem value="month">Ce mois</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PassagesTimeFilter;
