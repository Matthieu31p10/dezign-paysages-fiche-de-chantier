
import React from 'react';
import { ProjectInfo } from '@/types/models';
import { SchedulingRule } from './types';
import RuleForm from './RuleForm';

interface CreateRuleTabProps {
  projectInfos: ProjectInfo[];
  selectedProject: string;
  currentRule: Partial<SchedulingRule>;
  onProjectChange: (projectId: string) => void;
  onRuleChange: (rule: Partial<SchedulingRule>) => void;
  onSaveRule: () => void;
  onTogglePreferredDay: (day: string) => void;
  onTogglePreferredTime: (time: string) => void;
}

const CreateRuleTab: React.FC<CreateRuleTabProps> = (props) => {
  return <RuleForm {...props} />;
};

export default CreateRuleTab;
