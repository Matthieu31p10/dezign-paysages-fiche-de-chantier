
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthContext';
import { SettingsProvider } from './SettingsContext';
import { ProjectsProvider } from './ProjectsContext';
import { WorkLogsProvider } from './WorkLogsContext/WorkLogsContext';
import { TeamsProvider } from './TeamsContext';
import { AppProvider } from './AppContext';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <SettingsProvider>
            <TeamsProvider>
              <ProjectsProvider>
                <WorkLogsProvider>
                  <AppProvider>
                    {children}
                  </AppProvider>
                </WorkLogsProvider>
              </ProjectsProvider>
            </TeamsProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
