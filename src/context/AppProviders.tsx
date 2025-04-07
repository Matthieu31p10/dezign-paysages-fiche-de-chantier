
import React from 'react';
import { ProjectsProvider } from './ProjectsContext';
import { WorkLogsProvider } from './WorkLogsContext';
import { TeamsProvider } from './TeamsContext';
import { SettingsProvider } from './SettingsContext';
import { AuthProvider } from './AuthContext';
import { AppProvider } from './AppContext';
import { PreferencesProvider } from './PreferencesContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <PreferencesProvider>
          <WorkLogsProvider>
            <TeamsProvider>
              <ProjectsProvider>
                <AppProvider>
                  {children}
                </AppProvider>
              </ProjectsProvider>
            </TeamsProvider>
          </WorkLogsProvider>
        </PreferencesProvider>
      </AuthProvider>
    </SettingsProvider>
  );
};
