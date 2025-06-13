
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SchedulingRule } from '@/components/schedule/configuration/types';

interface SchedulingContextType {
  rules: SchedulingRule[];
  setRules: (rules: SchedulingRule[]) => void;
  addRule: (rule: SchedulingRule) => void;
  removeRule: (ruleId: string) => void;
  getRuleForProject: (projectId: string) => SchedulingRule | undefined;
}

const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

interface SchedulingProviderProps {
  children: ReactNode;
}

export const SchedulingProvider: React.FC<SchedulingProviderProps> = ({ children }) => {
  const [rules, setRules] = useState<SchedulingRule[]>([]);

  const addRule = (rule: SchedulingRule) => {
    setRules(prev => {
      const existingIndex = prev.findIndex(r => r.projectId === rule.projectId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = rule;
        return updated;
      }
      return [...prev, rule];
    });
  };

  const removeRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const getRuleForProject = (projectId: string) => {
    return rules.find(rule => rule.projectId === projectId);
  };

  return (
    <SchedulingContext.Provider value={{
      rules,
      setRules,
      addRule,
      removeRule,
      getRuleForProject
    }}>
      {children}
    </SchedulingContext.Provider>
  );
};

export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};
