
import React, { useMemo } from 'react';
import { ProjectsProvider } from './ProjectsContext';
import { TeamsProvider } from './TeamsContext';
import { SettingsProvider } from './SettingsContext';
import { WorkLogsProvider } from './WorkLogsContext/WorkLogsContext';
import { AppProvider } from './AppContext';
import { AuthProvider } from './AuthContext';
import { PermissionsProvider } from './PermissionsContext';
import { PerformanceProvider } from './PerformanceContext';
import { AnalyticsProvider } from './AnalyticsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <TeamsProvider>
            <WorkLogsProvider>
              <ProjectsProvider>
                <AppProvider>
                  <PermissionsProvider>
                    <PerformanceProvider>
                      <AnalyticsProvider enableAutoTracking={true}>
                        {children}
                      </AnalyticsProvider>
                    </PerformanceProvider>
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
