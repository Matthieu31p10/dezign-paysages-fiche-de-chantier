
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
      <SettingsProvider>
        <TeamsProvider>
          <ProjectsProvider>
            <WorkLogsProvider>
              <AppProvider>
                <MessagingProvider>
                  {children}
                </MessagingProvider>
              </AppProvider>
            </WorkLogsProvider>
          </ProjectsProvider>
        </TeamsProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default AppProviders;
