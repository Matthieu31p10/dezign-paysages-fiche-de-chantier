
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus } from 'lucide-react';
import { SchedulingRule } from '../types';

interface IntervalSectionProps {
  currentRule: Partial<SchedulingRule>;
  onRuleChange: (rule: Partial<SchedulingRule>) => void;
}

const IntervalSection: React.FC<IntervalSectionProps> = ({
  currentRule,
  onRuleChange
}) => {
  const handleIntervalValueChange = (value: string) => {
    const numValue = parseInt(value) || 1;
    onRuleChange({
      ...currentRule,
      intervalValue: Math.max(1, numValue)
    });
  };

  const incrementInterval = () => {
    const currentValue = currentRule.intervalValue || 1;
    onRuleChange({
      ...currentRule,
      intervalValue: currentValue + 1
    });
  };

  const decrementInterval = () => {
    const currentValue = currentRule.intervalValue || 1;
    onRuleChange({
      ...currentRule,
      intervalValue: Math.max(1, currentValue - 1)
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Type d'intervalle</Label>
        <Select 
          value={currentRule.intervalType} 
          onValueChange={(value) => onRuleChange({...currentRule, intervalType: value as any})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="days">Jours</SelectItem>
            <SelectItem value="weeks">Semaines</SelectItem>
            <SelectItem value="months">Mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Valeur d'intervalle</Label>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={decrementInterval}
            className="h-10 w-10 p-0 flex-shrink-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            max="365"
            value={currentRule.intervalValue || 1}
            onChange={(e) => handleIntervalValueChange(e.target.value)}
            className="text-center"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={incrementInterval}
            className="h-10 w-10 p-0 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Priorité</Label>
        <Select 
          value={currentRule.priority} 
          onValueChange={(value) => onRuleChange({...currentRule, priority: value as any})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Basse</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default IntervalSection;
