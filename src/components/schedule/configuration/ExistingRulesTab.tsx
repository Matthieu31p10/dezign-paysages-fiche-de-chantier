
import React from 'react';
import { Calendar } from 'lucide-react';
import { ProjectInfo } from '@/types/models';
import { SchedulingRule } from './types';
import RuleCard from './RuleCard';

interface ExistingRulesTabProps {
  rules: SchedulingRule[];
  projectInfos: ProjectInfo[];
}

const ExistingRulesTab: React.FC<ExistingRulesTabProps> = ({ rules, projectInfos }) => {
  if (rules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Aucune règle de planification configurée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rules.map((rule) => {
        const project = projectInfos.find(p => p.id === rule.projectId);
        return (
          <RuleCard key={rule.id} rule={rule} project={project} />
        );
      })}
    </div>
  );
};

export default ExistingRulesTab;
