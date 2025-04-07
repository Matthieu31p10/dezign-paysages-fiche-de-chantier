
import React from 'react';
import { ProjectsProvider } from './ProjectsContext';
import { WorkLogsProvider } from './WorkLogsContext';
import { TeamsProvider } from './TeamsContext';
import { SettingsProvider } from './SettingsContext';
import { AuthProvider } from './AuthContext';
import { AppProvider } from './AppContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <TeamsProvider>
          <WorkLogsProvider>
            <ProjectsProvider>
              <AppProvider>
                {children}
              </AppProvider>
            </ProjectsProvider>
          </WorkLogsProvider>
        </TeamsProvider>
      </AuthProvider>
    </SettingsProvider>
  );
};
