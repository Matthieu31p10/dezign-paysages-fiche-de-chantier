import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/SupabaseAuthContext';
import AppProviders from '@/context/AppProviders';

import { ErrorBoundary } from '@/components/error';

// Pages and components
import Index from './pages/Index';
import Projects from './pages/Projects';
import Home from './pages/Home';
import WorkLogs from './pages/WorkLogs';
import BlankWorkSheets from './pages/BlankWorkSheets';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { AuthPage, ProtectedRoute } from './components/auth';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ProfilePage } from './pages/ProfilePage';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AppProviders>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/home" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/projects" element={
                    <ProtectedRoute requiredPermission="projects">
                      <Projects />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/projects/:id" element={
                    <ProtectedRoute requiredPermission="projects">
                      <Projects />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/work-logs" element={
                    <ProtectedRoute requiredPermission="worklogs">
                      <WorkLogs />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/work-logs/:id" element={
                    <ProtectedRoute requiredPermission="worklogs">
                      <WorkLogs />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/blank-sheets" element={
                    <ProtectedRoute requiredPermission="blanksheets">
                      <BlankWorkSheets />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/reports" element={
                    <ProtectedRoute requiredPermission="reports">
                      <Reports />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute requiredRole="admin">
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  {/* Fallback redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </AppProviders>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <Toaster />
    </ErrorBoundary>
  )
}

export default App;