
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MonthlyRule } from '../types';
import { months } from '../constants';

export const useMonthlyRules = (projects: any[]) => {
  const [monthlyRules, setMonthlyRules] = useState<MonthlyRule[]>([]);

  const generateDefaultRules = () => {
    const rules: MonthlyRule[] = projects.map(project => {
      // Répartir le nombre de visites annuelles sur les 12 mois
      const baseVisitsPerMonth = Math.floor(project.annualVisits / 12);
      const extraVisits = project.annualVisits % 12;
      
      const monthlyVisits: Record<string, number> = {};
      
      months.forEach((_, index) => {
        // Ajouter une visite supplémentaire aux premiers mois jusqu'à épuiser extraVisits
        monthlyVisits[index.toString()] = baseVisitsPerMonth + (index < extraVisits ? 1 : 0);
      });
      
      return {
        projectId: project.id,
        monthlyVisits
      };
    });
    
    setMonthlyRules(rules);
    toast.success("Distribution mensuelle générée");
  };

  // Si aucune règle n'existe, générer par défaut
  useEffect(() => {
    if (monthlyRules.length === 0 && projects.length > 0) {
      generateDefaultRules();
    }
  }, [projects]);

  const handleMonthValueChange = (projectId: string, monthIndex: string, value: number) => {
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
  };

  const calculateAnnualTotal = (rule: MonthlyRule) => {
    return Object.values(rule.monthlyVisits).reduce((sum, val) => sum + val, 0);
  };

  return {
    monthlyRules,
    generateDefaultRules,
    handleMonthValueChange,
    calculateAnnualTotal
  };
};
