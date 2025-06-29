
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { timeSlots } from '../constants';
import { SchedulingRule } from '../types';

interface PreferredTimesSectionProps {
  currentRule: Partial<SchedulingRule>;
  onTogglePreferredTime: (time: string) => void;
}

const PreferredTimesSection: React.FC<PreferredTimesSectionProps> = ({
  currentRule,
  onTogglePreferredTime
}) => {
  return (
    <div className="space-y-3">
      <Label>Créneaux horaires préférés</Label>
      <div className="flex flex-wrap gap-2">
        {timeSlots.map((slot) => (
          <Button
            key={slot.value}
            variant={currentRule.preferredTimes?.includes(slot.value) ? "default" : "outline"}
            size="sm"
            onClick={() => onTogglePreferredTime(slot.value)}
          >
            <Clock className="h-4 w-4 mr-1" />
            {slot.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PreferredTimesSection;
