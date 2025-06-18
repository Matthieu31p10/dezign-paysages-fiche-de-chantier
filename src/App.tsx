
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { ProjectsProvider } from '@/context/ProjectsContext';
import { WorkLogsProvider } from '@/context/WorkLogsContext/WorkLogsContext';
import { BlankWorksheetsProvider } from '@/context/BlankWorksheetsContext/BlankWorksheetsContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Login from '@/components/auth/Login';
import Dashboard from './pages/Home';
import Projects from './pages/Projects';
import ProjectNew from './pages/ProjectNew';
import ProjectDetail from '@/components/projects/ProjectDetail';
import ProjectEdit from './pages/ProjectEdit';
import WorkLogs from './pages/WorkLogs';
import WorkLogNew from './pages/WorkLogNew';
import WorkLogDetail from '@/components/worklogs/detail/WorkLogDetail';
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
      <ProjectsProvider>
        <WorkLogsProvider>
          <BlankWorksheetsProvider>
            <AppProvider>
              <Router>
                <div className="App">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute element={<Layout />} />
                      }
                    />
                    <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="/projects" element={<ProtectedRoute element={<Projects />} />} />
                    <Route path="/projects/new" element={<ProtectedRoute element={<ProjectNew />} />} />
                    <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectDetail />} />} />
                    <Route path="/projects/:id/edit" element={<ProtectedRoute element={<ProjectEdit />} />} />
                    <Route path="/worklogs" element={<ProtectedRoute element={<WorkLogs />} />} />
                    <Route path="/worklogs/new" element={<ProtectedRoute element={<WorkLogNew />} />} />
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
            </AppProvider>
          </BlankWorksheetsProvider>
        </WorkLogsProvider>
      </ProjectsProvider>
    </AuthProvider>
  );
}

export default App;
