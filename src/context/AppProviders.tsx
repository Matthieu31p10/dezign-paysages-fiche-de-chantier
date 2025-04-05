
import React from 'react';
import { ProjectsProvider } from './ProjectsContext';
import { WorkLogsProvider } from './WorkLogsContext';
import { TeamsProvider } from './TeamsContext';
import { SettingsProvider } from './SettingsContext';
import { AuthProvider } from './AuthContext';
import { WorkTasksProvider } from './WorkTasksContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ProjectsProvider>
          <WorkLogsProvider>
            <TeamsProvider>
              <WorkTasksProvider>
                {children}
              </WorkTasksProvider>
            </TeamsProvider>
          </WorkLogsProvider>
        </ProjectsProvider>
      </AuthProvider>
    </SettingsProvider>
  );
};
