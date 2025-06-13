
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectInfo } from '@/types/models';
import { SchedulingRule } from './types';
import CreateRuleTab from './CreateRuleTab';
import ExistingRulesTab from './ExistingRulesTab';

interface ConfigurationTabsProps {
  projectInfos: ProjectInfo[];
  rules: SchedulingRule[];
  selectedProject: string;
  currentRule: Partial<SchedulingRule>;
  onProjectChange: (projectId: string) => void;
  onRuleChange: (rule: Partial<SchedulingRule>) => void;
  onSaveRule: () => void;
  onTogglePreferredDay: (day: string) => void;
  onTogglePreferredTime: (time: string) => void;
}

const ConfigurationTabs: React.FC<ConfigurationTabsProps> = ({
  projectInfos,
  rules,
  selectedProject,
  currentRule,
  onProjectChange,
  onRuleChange,
  onSaveRule,
  onTogglePreferredDay,
  onTogglePreferredTime,
}) => {
  return (
    <Tabs defaultValue="create" className="space-y-4">
      <TabsList>
        <TabsTrigger value="create">Créer une règle</TabsTrigger>
        <TabsTrigger value="existing">Règles existantes</TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="space-y-6">
        <CreateRuleTab
          projectInfos={projectInfos}
          selectedProject={selectedProject}
          currentRule={currentRule}
          onProjectChange={onProjectChange}
          onRuleChange={onRuleChange}
          onSaveRule={onSaveRule}
          onTogglePreferredDay={onTogglePreferredDay}
          onTogglePreferredTime={onTogglePreferredTime}
        />
      </TabsContent>

      <TabsContent value="existing" className="space-y-4">
        <ExistingRulesTab rules={rules} projectInfos={projectInfos} />
      </TabsContent>
    </Tabs>
  );
};

export default ConfigurationTabs;
