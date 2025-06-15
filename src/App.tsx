import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { ProjectsProvider } from '@/context/ProjectsContext';
import { WorkLogsProvider } from '@/context/WorkLogsContext/WorkLogsContext';
import { BlankWorksheetsProvider } from '@/context/BlankWorksheetsContext/BlankWorksheetsContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Login from './pages/Login'; // FIX: Chemin relatif
import Dashboard from './pages/Home'; // Home = Dashboard
import Projects from './pages/Projects';
import ProjectNew from './pages/ProjectNew';
import ProjectDetail from './pages/ProjectDetail';
import ProjectEdit from './pages/ProjectEdit';
import WorkLogs from './pages/WorkLogs';
import WorkLogNew from './pages/WorkLogNew';
import WorkLogDetail from './components/worklogs/WorkLogDetail';
import WorkLogEdit from './pages/WorkLogEdit';
import BlankWorkSheets from './pages/BlankWorkSheets';
import BlankWorkSheetNew from './pages/BlankWorkSheetNew';
import BlankWorkSheetDetail from './pages/BlankWorkSheetDetail';
import BlankWorkSheetEdit from './pages/BlankWorkSheetEdit';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ProjectsProvider>
          <WorkLogsProvider>
            <BlankWorksheetsProvider>
              <Router>
                <div className="App">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="/projects" element={<ProtectedRoute element={<Projects />} />} />
                    <Route path="/projects/new" element={<ProtectedRoute element={<ProjectNew />} />} />
                    <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectDetail />} />} />
                    <Route path="/projects/:id/edit" element={<ProtectedRoute element={<ProjectEdit />} />} />
                    <Route path="/worklogs" element={<ProtectedRoute element={<WorkLogs />} />} />
                    <Route path="/worklogs/new" element={<ProtectedRoute element={<WorkLogNew />} />} />
                    {/* Utilisation du composant WorkLogDetail wrapper */}
                    <Route path="/worklogs/:id" element={<ProtectedRoute element={<WorkLogDetail />} />} />
                    <Route path="/worklogs/:id/edit" element={<ProtectedRoute element={<WorkLogEdit />} />} />
                    <Route path="/blank-worksheets" element={<ProtectedRoute element={<BlankWorkSheets />} />} />
                    <Route path="/blank-worksheets/new" element={<ProtectedRoute element={<BlankWorkSheetNew />} />} />
                    <Route path="/blank-worksheets/:id" element={<ProtectedRoute element={<BlankWorkSheetDetail />} />} />
                    <Route path="/blank-worksheets/:id/edit" element={<ProtectedRoute element={<BlankWorkSheetEdit />} />} />
                    <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
                    <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
                    <Route path="/settings/personnel" element={<ProtectedRoute element={<Settings />} />} />
                    <Route path="/settings/teams" element={<ProtectedRoute element={<Settings />} />} />
                    <Route path="/settings/custom-tasks" element={<ProtectedRoute element={<Settings />} />} />
                    <Route path="/settings/company" element={<ProtectedRoute element={<Settings />} />} />
                  </Routes>
                  <Toaster position="top-right" />
                </div>
              </Router>
            </BlankWorksheetsProvider>
          </WorkLogsProvider>
        </ProjectsProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
