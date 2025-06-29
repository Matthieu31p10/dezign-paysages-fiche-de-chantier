
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface PassageSpacingRule {
  projectId: string;
  spacingType: 'days' | 'weeks' | 'months';
  spacingValue: number;
  isPriority: boolean;
}

export const usePassageSpacing = (projects: any[]) => {
  const [spacingRules, setSpacingRules] = useState<PassageSpacingRule[]>([]);

  const generateDefaultSpacingRules = useCallback(() => {
    const rules: PassageSpacingRule[] = projects.map(project => ({
      projectId: project.id,
      spacingType: 'months' as const,
      spacingValue: Math.max(1, Math.floor(12 / (project.annualVisits || 12))),
      isPriority: false
    }));
    
    setSpacingRules(rules);
    toast.success("Règles d'espacement générées par défaut");
  }, [projects]);

  const updateSpacingRule = useCallback((
    projectId: string, 
    updates: Partial<PassageSpacingRule>
  ) => {
    setSpacingRules(prev => 
      prev.map(rule => 
        rule.projectId === projectId 
          ? { ...rule, ...updates }
          : rule
      )
    );
  }, []);

  const getSpacingRule = useCallback((projectId: string) => {
    return spacingRules.find(rule => rule.projectId === projectId);
  }, [spacingRules]);

  const calculateOptimalDistribution = useCallback((
    projectId: string, 
    annualVisits: number
  ) => {
    const rule = getSpacingRule(projectId);
    if (!rule || !rule.isPriority) {
      // Distribution normale si pas de règle prioritaire
      const baseVisitsPerMonth = Math.floor(annualVisits / 12);
      const extraVisits = annualVisits % 12;
      
      const distribution: Record<string, number> = {};
      for (let i = 0; i < 12; i++) {
        distribution[i.toString()] = baseVisitsPerMonth + (i < extraVisits ? 1 : 0);
      }
      return distribution;
    }

    // Distribution basée sur l'espacement prioritaire
    const distribution: Record<string, number> = {};
    for (let i = 0; i < 12; i++) {
      distribution[i.toString()] = 0;
    }

    let spacingInMonths: number;
    switch (rule.spacingType) {
      case 'days':
        spacingInMonths = rule.spacingValue / 30; // Approximation
        break;
      case 'weeks':
        spacingInMonths = rule.spacingValue / 4; // Approximation
        break;
      case 'months':
        spacingInMonths = rule.spacingValue;
        break;
      default:
        spacingInMonths = 1;
    }

    // Répartir les visites selon l'espacement
    let currentMonth = 0;
    let remainingVisits = annualVisits;

    while (remainingVisits > 0 && currentMonth < 12) {
      distribution[currentMonth.toString()]++;
      remainingVisits--;
      currentMonth = Math.min(11, currentMonth + Math.round(spacingInMonths));
    }

    // Distribuer les visites restantes
    if (remainingVisits > 0) {
      for (let i = 0; i < 12 && remainingVisits > 0; i++) {
        if (distribution[i.toString()] === 0) {
          distribution[i.toString()]++;
          remainingVisits--;
        }
      }
    }

    return distribution;
  }, [getSpacingRule]);

  return {
    spacingRules,
    generateDefaultSpacingRules,
    updateSpacingRule,
    getSpacingRule,
    calculateOptimalDistribution
  };
};
