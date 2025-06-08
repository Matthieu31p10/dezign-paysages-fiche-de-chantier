
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectsProvider } from './projects/ProjectsProvider';
import { WorkLogsProvider } from './WorkLogsContext';
import { TeamsProvider } from './teams/TeamsProvider';
import { SettingsProvider } from './settings/SettingsProvider';
import { AuthProvider } from './AuthContext';
import { AppProvider } from './AppContext';

// Configuration optimisée de React Query pour de meilleures performances
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};
