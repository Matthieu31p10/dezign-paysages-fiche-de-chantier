
import React from 'react';
import { ProjectsProvider } from './ProjectsContext';
import { TeamsProvider } from './TeamsContext';
import { SettingsProvider } from './SettingsContext';
import { WorkLogsProvider } from './WorkLogsContext/WorkLogsContext';
import { SchedulingProvider } from './SchedulingContext';
import { AppProvider } from './AppContext';
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
        <TeamsProvider>
          <WorkLogsProvider>
            <ProjectsProvider>
              <SchedulingProvider>
                <AppProvider>
                  {children}
                </AppProvider>
              </SchedulingProvider>
            </ProjectsProvider>
          </WorkLogsProvider>
        </TeamsProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
