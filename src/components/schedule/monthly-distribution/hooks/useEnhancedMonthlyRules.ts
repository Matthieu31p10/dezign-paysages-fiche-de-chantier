
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { MonthlyRule } from '../types';
import { months } from '../constants';
import { usePassageSpacing, PassageSpacingRule } from './usePassageSpacing';

export const useEnhancedMonthlyRules = (projects: any[]) => {
  const [monthlyRules, setMonthlyRules] = useState<MonthlyRule[]>([]);
  const [showSpacingConfig, setShowSpacingConfig] = useState<boolean>(false);
  
  const {
    spacingRules,
    generateDefaultSpacingRules,
    updateSpacingRule,
    calculateOptimalDistribution
  } = usePassageSpacing(projects);

  const generateDefaultRules = useCallback(() => {
    const rules: MonthlyRule[] = projects.map(project => {
      const distribution = calculateOptimalDistribution(project.id, project.annualVisits || 12);
      
      return {
        projectId: project.id,
        monthlyVisits: distribution
      };
    });
    
    setMonthlyRules(rules);
    toast.success("Distribution mensuelle générée");
  }, [projects, calculateOptimalDistribution]);

  const applySpacingToDistribution = useCallback(() => {
    const updatedRules: MonthlyRule[] = monthlyRules.map(rule => {
      const project = projects.find(p => p.id === rule.projectId);
      if (!project) return rule;

      const distribution = calculateOptimalDistribution(rule.projectId, project.annualVisits || 12);
      
      return {
        ...rule,
        monthlyVisits: distribution
      };
    });
    
    setMonthlyRules(updatedRules);
    toast.success("Distribution mise à jour selon l'espacement configuré");
  }, [monthlyRules, projects, calculateOptimalDistribution]);

  // Si aucune règle n'existe, générer par défaut
  useEffect(() => {
    if (monthlyRules.length === 0 && projects.length > 0) {
      generateDefaultRules();
    }
  }, [projects.length, monthlyRules.length]); // Only depend on length to avoid re-runs

  // Générer les règles d'espacement par défaut si nécessaire
  useEffect(() => {
    if (spacingRules.length === 0 && projects.length > 0) {
      generateDefaultSpacingRules();
    }
  }, [projects.length, spacingRules.length]); // Only depend on length to avoid re-runs

  const handleMonthValueChange = useCallback((projectId: string, monthIndex: string, value: number) => {
    setMonthlyRules(prevRules => {
      return prevRules.map(rule => {
        if (rule.projectId === projectId) {
          return {
            ...rule,
            monthlyVisits: {
              ...rule.monthlyVisits,
              [monthIndex]: value
            }
          };
        }
        return rule;
      });
    });
  }, []);

  const calculateAnnualTotal = useCallback((rule: MonthlyRule) => {
    return Object.values(rule.monthlyVisits).reduce((sum, val) => sum + val, 0);
  }, []);

  return {
    monthlyRules,
    spacingRules,
    showSpacingConfig,
    setShowSpacingConfig,
    generateDefaultRules,
    generateDefaultSpacingRules,
    updateSpacingRule,
    applySpacingToDistribution,
    handleMonthValueChange,
    calculateAnnualTotal
  };
};
