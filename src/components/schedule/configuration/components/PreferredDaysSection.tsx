
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { daysOfWeek } from '../constants';
import { SchedulingRule } from '../types';

interface PreferredDaysSectionProps {
  currentRule: Partial<SchedulingRule>;
  onTogglePreferredDay: (day: string) => void;
}

const PreferredDaysSection: React.FC<PreferredDaysSectionProps> = ({
  currentRule,
  onTogglePreferredDay
}) => {
  return (
    <div className="space-y-3">
      <Label>Jours préférés</Label>
      <div className="flex flex-wrap gap-2">
        {daysOfWeek.map((day) => (
          <Button
            key={day.value}
            variant={currentRule.preferredDays?.includes(day.value) ? "default" : "outline"}
            size="sm"
            onClick={() => onTogglePreferredDay(day.value)}
          >
            {day.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PreferredDaysSection;
