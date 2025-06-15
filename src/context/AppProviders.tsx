
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SettingsProvider } from './SettingsContext';
import { AuthProvider } from './AuthContext';
import { SupabaseAuthProvider } from './SupabaseAuthContext';
import { TeamsProvider } from './TeamsContext';
import { ProjectsProvider } from './ProjectsContext';
import { WorkLogsProvider } from './WorkLogsContext/WorkLogsContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <SupabaseAuthProvider>
          <AuthProvider>
            <TeamsProvider>
              <WorkLogsProvider>
                <ProjectsProvider>
                  {children}
                </ProjectsProvider>
              </WorkLogsProvider>
            </TeamsProvider>
          </AuthProvider>
        </SupabaseAuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
