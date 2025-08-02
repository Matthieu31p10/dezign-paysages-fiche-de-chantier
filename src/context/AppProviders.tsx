
import React from 'react';
import { ProjectsProvider } from './ProjectsContext';
import { TeamsProvider } from './TeamsContext';
import { SettingsProvider } from './SettingsContext';
import { WorkLogsProvider } from './WorkLogsContext/WorkLogsContext';
import { AppProvider } from './AppContext';
import { AuthProvider } from './AuthContext';
import { PermissionsProvider } from './PermissionsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <TeamsProvider>
            <WorkLogsProvider>
              <ProjectsProvider>
                <AppProvider>
                  <PermissionsProvider>
                    {children}
                  </PermissionsProvider>
                </AppProvider>
              </ProjectsProvider>
            </WorkLogsProvider>
          </TeamsProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
