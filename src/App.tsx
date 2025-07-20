
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppProviders from './context/AppProviders';
import Layout from './components/layout/Layout';
import Projects from './pages/Projects';
import WorkLogs from './pages/WorkLogs';
import Reports from './pages/Reports';
import ProjectNew from './pages/ProjectNew';
import ProjectEdit from './pages/ProjectEdit';
import ProjectDetail from './components/projects/ProjectDetail';
import WorkLogNew from './pages/WorkLogNew';
import WorkLogEdit from './pages/WorkLogEdit';
import WorkLogDetail from './components/worklogs/detail/WorkLogDetail';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Login from './components/auth/Login';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ClientDashboard from './pages/ClientDashboard';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
// Removed ErrorBoundary import - using new error handling system
import BlankWorkSheets from './pages/BlankWorkSheets';
import BlankWorkSheetNew from './pages/BlankWorkSheetNew';
import Passages from './pages/Passages';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AppProviders>
        <Router>
          <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
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
              <Route path="blank-worksheets" element={<ProtectedRoute requiredModule="blanksheets" element={<BlankWorkSheets />} />} />
              <Route path="blank-worksheets/new" element={<ProtectedRoute requiredModule="blanksheets" element={<BlankWorkSheetNew />} />} />
              
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </AppProviders>
  );
}

export default App;
