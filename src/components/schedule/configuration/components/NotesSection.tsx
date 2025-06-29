
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SchedulingRule } from '../types';

interface NotesSectionProps {
  currentRule: Partial<SchedulingRule>;
  onRuleChange: (rule: Partial<SchedulingRule>) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  currentRule,
  onRuleChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Consignes spéciales</Label>
      <Textarea
        placeholder="Ajoutez des consignes particulières pour ce chantier..."
        value={currentRule.notes || ''}
        onChange={(e) => onRuleChange({
          ...currentRule,
          notes: e.target.value
        })}
        className="min-h-20"
      />
    </div>
  );
};

export default NotesSection;
