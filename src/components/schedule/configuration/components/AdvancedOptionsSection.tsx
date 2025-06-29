
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SchedulingRule } from '../types';

interface AdvancedOptionsSectionProps {
  currentRule: Partial<SchedulingRule>;
  onRuleChange: (rule: Partial<SchedulingRule>) => void;
}

const AdvancedOptionsSection: React.FC<AdvancedOptionsSectionProps> = ({
  currentRule,
  onRuleChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="skip-weekends"
          checked={currentRule.skipWeekends || false}
          onCheckedChange={(checked) => onRuleChange({
            ...currentRule,
            skipWeekends: checked
          })}
        />
        <Label htmlFor="skip-weekends">Éviter les weekends</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="skip-holidays"
          checked={currentRule.skipHolidays || false}
          onCheckedChange={(checked) => onRuleChange({
            ...currentRule,
            skipHolidays: checked
          })}
        />
        <Label htmlFor="skip-holidays">Éviter les jours fériés</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto-adjust"
          checked={currentRule.autoAdjust || false}
          onCheckedChange={(checked) => onRuleChange({
            ...currentRule,
            autoAdjust: checked
          })}
        />
        <Label htmlFor="auto-adjust">Ajustement automatique en cas de conflit</Label>
      </div>
    </div>
  );
};

export default AdvancedOptionsSection;
