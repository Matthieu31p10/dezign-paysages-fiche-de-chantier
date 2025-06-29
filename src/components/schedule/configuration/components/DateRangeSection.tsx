
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SchedulingRule } from '../types';

interface DateRangeSectionProps {
  currentRule: Partial<SchedulingRule>;
  onRuleChange: (rule: Partial<SchedulingRule>) => void;
}

const DateRangeSection: React.FC<DateRangeSectionProps> = ({
  currentRule,
  onRuleChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Date de début (optionnel)</Label>
        <Input
          type="date"
          value={currentRule.startDate || ''}
          onChange={(e) => onRuleChange({
            ...currentRule,
            startDate: e.target.value
          })}
        />
      </div>
      <div className="space-y-2">
        <Label>Date de fin (optionnel)</Label>
        <Input
          type="date"
          value={currentRule.endDate || ''}
          onChange={(e) => onRuleChange({
            ...currentRule,
            endDate: e.target.value
          })}
        />
      </div>
    </div>
  );
};

export default DateRangeSection;
