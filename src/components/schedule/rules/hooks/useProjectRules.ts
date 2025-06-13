
import { useState } from 'react';
import { ProjectRule } from '../types';
import { toast } from 'sonner';

export const useProjectRules = () => {
  const [projectRules, setProjectRules] = useState<ProjectRule[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [fixedDays, setFixedDays] = useState<Record<string, boolean>>({});
  const [distributionStrategy, setDistributionStrategy] = useState<'even' | 'start' | 'end'>('even');
  const [maxConsecutiveDays, setMaxConsecutiveDays] = useState<number>(1);

  const handleAddRule = () => {
    if (!selectedProject) {
      toast.error("Veuillez sélectionner un chantier");
      return;
    }
    
    const newRule: ProjectRule = {
      projectId: selectedProject,
      fixedDays,
      distributionStrategy,
      maxConsecutiveDays,
    };
    
    const existingRuleIndex = projectRules.findIndex(rule => rule.projectId === selectedProject);
    
    if (existingRuleIndex >= 0) {
      const updatedRules = [...projectRules];
      updatedRules[existingRuleIndex] = newRule;
      setProjectRules(updatedRules);
      toast.success("Règle mise à jour avec succès");
    } else {
      setProjectRules([...projectRules, newRule]);
      toast.success("Règle ajoutée avec succès");
    }
    
    resetForm();
  };
  
  const handleRemoveRule = (projectId: string) => {
    setProjectRules(projectRules.filter(rule => rule.projectId !== projectId));
    toast.success("Règle supprimée");
  };
  
  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    
    const existingRule = projectRules.find(rule => rule.projectId === projectId);
    
    if (existingRule) {
      setFixedDays(existingRule.fixedDays);
      setDistributionStrategy(existingRule.distributionStrategy);
      setMaxConsecutiveDays(existingRule.maxConsecutiveDays);
    } else {
      resetForm();
    }
  };
  
  const handleFixedDayChange = (day: string, checked: boolean) => {
    setFixedDays(prev => ({ ...prev, [day]: checked }));
  };

  const resetForm = () => {
    setSelectedProject('');
    setFixedDays({});
    setDistributionStrategy('even');
    setMaxConsecutiveDays(1);
  };

  return {
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
  };
};
