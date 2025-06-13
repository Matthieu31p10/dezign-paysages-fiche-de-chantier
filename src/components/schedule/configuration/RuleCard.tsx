
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { ProjectInfo } from '@/types/models';
import { SchedulingRule } from './types';
import { timeSlots, getPriorityColor } from './constants';

interface RuleCardProps {
  rule: SchedulingRule;
  project?: ProjectInfo;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, project }) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold">{project?.name}</h4>
          <p className="text-sm text-gray-600">{project?.address}</p>
        </div>
        <Badge className={getPriorityColor(rule.priority)}>
          {rule.priority === 'high' ? 'Haute' : 
           rule.priority === 'medium' ? 'Moyenne' : 'Basse'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="font-medium">Intervalle:</span>
          <p>{rule.intervalValue} {rule.intervalType === 'days' ? 'jour(s)' : 
             rule.intervalType === 'weeks' ? 'semaine(s)' : 'mois'}</p>
        </div>
        
        {rule.preferredDays.length > 0 && (
          <div>
            <span className="font-medium">Jours préférés:</span>
            <p>{rule.preferredDays.join(', ')}</p>
          </div>
        )}
        
        {rule.preferredTimes.length > 0 && (
          <div>
            <span className="font-medium">Créneaux:</span>
            <p>{rule.preferredTimes.map(t => 
              timeSlots.find(s => s.value === t)?.label).join(', ')}</p>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {rule.skipWeekends && <Badge variant="outline" className="text-xs">Sans WE</Badge>}
          {rule.skipHolidays && <Badge variant="outline" className="text-xs">Sans fériés</Badge>}
          {rule.autoAdjust && <Badge variant="outline" className="text-xs">Auto-ajust</Badge>}
        </div>
      </div>
      
      {rule.notes && (
        <div className="mt-3 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-yellow-800">{rule.notes}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RuleCard;
