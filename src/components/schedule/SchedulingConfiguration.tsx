
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { SchedulingRule } from './configuration/types';
import ConfigurationTabs from './configuration/ConfigurationTabs';

const SchedulingConfiguration: React.FC = () => {
  const { projectInfos } = useApp();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [rules, setRules] = useState<SchedulingRule[]>([]);
  const [currentRule, setCurrentRule] = useState<Partial<SchedulingRule>>({
    intervalType: 'weeks',
    intervalValue: 2,
    skipWeekends: true,
    skipHolidays: true,
    preferredDays: [],
    preferredTimes: [],
    notes: '',
    priority: 'medium',
    autoAdjust: true
  });

  const handleSaveRule = () => {
    if (!selectedProject) {
      toast.error("Veuillez sélectionner un projet");
      return;
    }

    const newRule: SchedulingRule = {
      id: `rule-${Date.now()}`,
      projectId: selectedProject,
      ...currentRule as SchedulingRule
    };

    setRules([...rules, newRule]);
    setCurrentRule({
      intervalType: 'weeks',
      intervalValue: 2,
      skipWeekends: true,
      skipHolidays: true,
      preferredDays: [],
      preferredTimes: [],
      notes: '',
      priority: 'medium',
      autoAdjust: true
    });
    
    toast.success("Règle de planification sauvegardée");
  };

  const togglePreferredDay = (day: string) => {
    const current = currentRule.preferredDays || [];
    if (current.includes(day)) {
      setCurrentRule({
        ...currentRule,
        preferredDays: current.filter(d => d !== day)
      });
    } else {
      setCurrentRule({
        ...currentRule,
        preferredDays: [...current, day]
      });
    }
  };

  const togglePreferredTime = (time: string) => {
    const current = currentRule.preferredTimes || [];
    if (current.includes(time)) {
      setCurrentRule({
        ...currentRule,
        preferredTimes: current.filter(t => t !== time)
      });
    } else {
      setCurrentRule({
        ...currentRule,
        preferredTimes: [...current, time]
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Configuration des consignes de chantier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationTabs
            projectInfos={projectInfos}
            rules={rules}
            selectedProject={selectedProject}
            currentRule={currentRule}
            onProjectChange={setSelectedProject}
            onRuleChange={setCurrentRule}
            onSaveRule={handleSaveRule}
            onTogglePreferredDay={togglePreferredDay}
            onTogglePreferredTime={togglePreferredTime}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingConfiguration;
