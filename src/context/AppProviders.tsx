
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
    <AuthProvider>
      <ProjectsProvider>
        <WorkLogsProvider>
          <TeamsProvider>
            <SettingsProvider>
              <WorkTasksProvider>
                {children}
              </WorkTasksProvider>
            </SettingsProvider>
          </TeamsProvider>
        </WorkLogsProvider>
      </ProjectsProvider>
    </AuthProvider>
  );
};
