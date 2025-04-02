
import React from 'react';
import { ProjectsProvider } from './ProjectsContext';
import { WorkLogsProvider } from './WorkLogsContext';
import { TeamsProvider } from './TeamsContext';
import { SettingsProvider } from './SettingsContext';
import { AuthProvider } from './AuthContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <WorkLogsProvider>
          <TeamsProvider>
            <ProjectsProvider>
              {children}
            </ProjectsProvider>
          </TeamsProvider>
        </WorkLogsProvider>
      </AuthProvider>
    </SettingsProvider>
  );
};
