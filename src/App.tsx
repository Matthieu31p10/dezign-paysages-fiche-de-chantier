
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Projects from './pages/Projects';
import WorkLogs from './pages/WorkLogs';
import Reports from './pages/Reports';
import ProjectNew from './pages/ProjectNew';
import ProjectEdit from './pages/ProjectEdit';
import ProjectDetail from './components/projects/ProjectDetail';
import WorkLogNew from './pages/WorkLogNew';
import WorkLogEdit from './pages/WorkLogEdit';
import WorkLogDetail from './components/worklogs/WorkLogDetail';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/projects" replace />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<ProjectNew />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="projects/:id/edit" element={<ProjectEdit />} />
            <Route path="worklogs" element={<WorkLogs />} />
            <Route path="worklogs/new" element={<WorkLogNew />} />
            <Route path="worklogs/:id" element={<WorkLogDetail />} />
            <Route path="worklogs/:id/edit" element={<WorkLogEdit />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
      <SonnerToaster position="top-right" richColors />
    </AppProvider>
  );
}

export default App;
