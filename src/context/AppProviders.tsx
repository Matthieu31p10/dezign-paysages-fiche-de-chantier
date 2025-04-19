
import React from 'react';
import { AuthProvider } from './AuthContext';
import { AppProvider } from './AppContext';
import { TeamsProvider } from './TeamsContext';
import { WorkLogsProvider } from './WorkLogsContext';
import { ProjectsProvider } from './ProjectsContext';
import { SettingsProvider } from './SettingsContext';
import { MessagingProvider } from './MessagingContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AppProvider>
        <SettingsProvider>
          <TeamsProvider>
            <ProjectsProvider>
              <WorkLogsProvider>
                <MessagingProvider>
                  {children}
                </MessagingProvider>
              </WorkLogsProvider>
            </ProjectsProvider>
          </TeamsProvider>
        </SettingsProvider>
      </AppProvider>
    </AuthProvider>
  );
};
