
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { ProjectInfo } from '@/types/models';
import { SchedulingRule } from './types';
import ProjectSelector from './components/ProjectSelector';
import IntervalSection from './components/IntervalSection';
import DateRangeSection from './components/DateRangeSection';
import PreferredDaysSection from './components/PreferredDaysSection';
import PreferredTimesSection from './components/PreferredTimesSection';
import AdvancedOptionsSection from './components/AdvancedOptionsSection';
import NotesSection from './components/NotesSection';

interface RuleFormProps {
  projectInfos: ProjectInfo[];
  selectedProject: string;
  currentRule: Partial<SchedulingRule>;
  onProjectChange: (projectId: string) => void;
  onRuleChange: (rule: Partial<SchedulingRule>) => void;
  onSaveRule: () => void;
  onTogglePreferredDay: (day: string) => void;
  onTogglePreferredTime: (time: string) => void;
}

const RuleForm: React.FC<RuleFormProps> = ({
  projectInfos,
  selectedProject,
  currentRule,
  onProjectChange,
  onRuleChange,
  onSaveRule,
  onTogglePreferredDay,
  onTogglePreferredTime,
}) => {
  return (
    <div className="space-y-6">
      <ProjectSelector
        projectInfos={projectInfos}
        selectedProject={selectedProject}
        onProjectChange={onProjectChange}
      />

      <IntervalSection
        currentRule={currentRule}
        onRuleChange={onRuleChange}
      />

      <DateRangeSection
        currentRule={currentRule}
        onRuleChange={onRuleChange}
      />

      <PreferredDaysSection
        currentRule={currentRule}
        onTogglePreferredDay={onTogglePreferredDay}
      />

      <PreferredTimesSection
        currentRule={currentRule}
        onTogglePreferredTime={onTogglePreferredTime}
      />

      <AdvancedOptionsSection
        currentRule={currentRule}
        onRuleChange={onRuleChange}
      />

      <NotesSection
        currentRule={currentRule}
        onRuleChange={onRuleChange}
      />

      <Button onClick={onSaveRule} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Sauvegarder la règle
      </Button>
    </div>
  );
};

export default RuleForm;
