
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './context/AppProviders';
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
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import BlankWorkSheets from './pages/BlankWorkSheets';
import './App.css';

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/projects" replace />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/new" element={<ProjectNew />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="projects/:id/edit" element={<ProjectEdit />} />
              <Route path="worklogs" element={<WorkLogs />} />
              <Route path="worklogs/new" element={<WorkLogNew />} />
              <Route path="worklogs/:id" element={<WorkLogDetail />} />
              <Route path="worklogs/edit/:id" element={<WorkLogEdit />} />
              
              {/* Use a route with ProtectedRoute wrapper for the module */}
              <Route path="blank-worksheets" element={<ProtectedRoute requiredModule="blanksheets" element={<BlankWorkSheets />} />} />
              
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
