import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppProviders from './context/AppProviders';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { PageLoadingFallback } from './components/common/LoadingFallback';

// Eager loaded components (needed immediately)
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loaded pages
const Layout = lazy(() => import('./components/layout/Layout'));
const Index = lazy(() => import('./pages/Index'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectNew = lazy(() => import('./pages/ProjectNew'));
const ProjectEdit = lazy(() => import('./pages/ProjectEdit'));
const ProjectDetail = lazy(() => import('./components/projects/ProjectDetail'));
const WorkLogs = lazy(() => import('./pages/WorkLogs'));
const WorkLogNew = lazy(() => import('./pages/WorkLogNew'));
const WorkLogEdit = lazy(() => import('./pages/WorkLogEdit'));
const WorkLogDetail = lazy(() => import('./components/worklogs/detail/WorkLogDetail'));
const BlankWorkSheets = lazy(() => import('./pages/BlankWorkSheets'));
const BlankWorkSheetNew = lazy(() => import('./pages/BlankWorkSheetNew'));
const Passages = lazy(() => import('./pages/Passages'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const Phase4Components = lazy(() => import('./components/Phase4Components'));
const Login = lazy(() => import('./components/auth/Login'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

import './App.css';

function App() {
  return (
    <AppProviders>
      <Router>
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/new" element={<ProjectNew />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="projects/:id/edit" element={<ProjectEdit />} />
                
                {/* Passages route */}
                <Route path="passages" element={<Passages />} />
                
                <Route path="worklogs" element={<WorkLogs />} />
                <Route path="worklogs/new" element={<WorkLogNew />} />
                <Route path="worklogs/:id" element={<WorkLogDetail />} />
                <Route path="worklogs/:id/edit" element={<WorkLogEdit />} />
                
                {/* Blank worksheets routes */}
                <Route path="blank-worksheets" element={<BlankWorkSheets />} />
                <Route path="blank-worksheets/new" element={<BlankWorkSheetNew />} />
                
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="phase4" element={<Phase4Components />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </Router>
    </AppProviders>
  );
}

export default App;
