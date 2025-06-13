
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectInfo, Team } from '@/types/models';
import { useProjectRules } from './rules/hooks/useProjectRules';
import RuleForm from './rules/components/RuleForm';
import RulesTable from './rules/components/RulesTable';

interface SchedulingRulesProps {
  projects: ProjectInfo[];
  teams: Team[];
}

const SchedulingRules: React.FC<SchedulingRulesProps> = ({ projects, teams }) => {
  const {
    projectRules,
    selectedProject,
    fixedDays,
    distributionStrategy,
    maxConsecutiveDays,
    handleAddRule,
    handleRemoveRule,
    handleSelectProject,
    handleFixedDayChange,
    setDistributionStrategy,
    setMaxConsecutiveDays,
  } = useProjectRules();

  const hasExistingRule = projectRules.some(rule => rule.projectId === selectedProject);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Définir des règles</CardTitle>
        </CardHeader>
        <CardContent>
          <RuleForm
            projects={projects}
            selectedProject={selectedProject}
            fixedDays={fixedDays}
            distributionStrategy={distributionStrategy}
            maxConsecutiveDays={maxConsecutiveDays}
            onProjectSelect={handleSelectProject}
            onFixedDayChange={handleFixedDayChange}
            onDistributionStrategyChange={setDistributionStrategy}
            onMaxConsecutiveDaysChange={setMaxConsecutiveDays}
            onAddRule={handleAddRule}
            hasExistingRule={hasExistingRule}
          />
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Règles de planification</CardTitle>
        </CardHeader>
        <CardContent>
          <RulesTable
            projectRules={projectRules}
            projects={projects}
            onRemoveRule={handleRemoveRule}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingRules;
