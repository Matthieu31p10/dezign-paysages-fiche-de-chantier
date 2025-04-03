import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  ProjectInfo,
  WorkLog,
  Team,
  User,
  AppSettings,
  Personnel,
} from '@/types/models';
import {
  AuthProviderProps,
  ProjectsContextType,
  WorkLogsContextType,
  TeamsContextType,
  AppContextType,
  SettingsContextType,
} from './types';
import { AuthProvider } from './AuthContext';
import { ProjectsProvider } from './ProjectsContext';
import { WorkLogsProvider } from './WorkLogsContext';
import { TeamsProvider } from './TeamsContext';
import { SettingsProvider } from './SettingsContext';

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <TeamsProvider>
        <ProjectsProvider>
          <WorkLogsProvider>
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </WorkLogsProvider>
        </ProjectsProvider>
      </TeamsProvider>
    </AuthProvider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Custom hook to access all contexts
export const useApp = () => {
  const auth = useContext(React.createContext<AuthProviderProps | undefined>(undefined));
  const projects = useContext(React.createContext<ProjectsContextType | undefined>(undefined));
  const worklogs = useContext(React.createContext<WorkLogsContextType | undefined>(undefined));
  const teams = useContext(React.createContext<TeamsContextType | undefined>(undefined));
  const settings = useContext(React.createContext<SettingsContextType | undefined>(undefined));

  if (!auth || !projects || !worklogs || !teams || !settings) {
    throw new Error(
      'useApp must be used within an AppProvider containing all context providers'
    );
  }

  return {
    ...auth,
    ...projects,
    ...worklogs,
    ...teams,
    ...settings,
  };
};
