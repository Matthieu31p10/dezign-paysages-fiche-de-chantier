
import React from 'react';
import { ProjectsProvider } from './ProjectsContext';
import { WorkLogsProvider } from './WorkLogsContext';
import { WorkTasksProvider } from './WorkTasksContext';
import { TeamsProvider } from './TeamsContext';
import { SettingsProvider } from './SettingsContext';
import { AuthProvider } from './AuthContext';
import { AppProvider } from './AppContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <TeamsProvider>
          <ProjectsProvider>
            <WorkLogsProvider>
              <WorkTasksProvider>
                <AppProvider>
                  {children}
                </AppProvider>
              </WorkTasksProvider>
            </WorkLogsProvider>
          </ProjectsProvider>
        </TeamsProvider>
      </AuthProvider>
    </SettingsProvider>
  );
};
