
import React, { createContext, useContext } from 'react';
import { Team, Personnel, CustomTask } from '@/types/models';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';

interface AppContextType {
  teams: Team[];
  personnel: Personnel[];
  customTasks: CustomTask[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { teams } = useTeams();
  const { getPersonnel, getCustomTasks } = useSettings();

  return (
    <AppContext.Provider
      value={{
        teams,
        personnel: getPersonnel(),
        customTasks: getCustomTasks(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
