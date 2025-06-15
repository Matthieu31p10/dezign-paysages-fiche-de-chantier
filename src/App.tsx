
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
import WorkLogDetail from './pages/WorkLogDetail';
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
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/projects" element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    } />
                    <Route path="/projects/new" element={
                      <ProtectedRoute>
                        <ProjectNew />
                      </ProtectedRoute>
                    } />
                    <Route path="/projects/:id" element={
                      <ProtectedRoute>
                        <ProjectDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/projects/:id/edit" element={
                      <ProtectedRoute>
                        <ProjectEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="/worklogs" element={
                      <ProtectedRoute>
                        <WorkLogs />
                      </ProtectedRoute>
                    } />
                    <Route path="/worklogs/new" element={
                      <ProtectedRoute>
                        <WorkLogNew />
                      </ProtectedRoute>
                    } />
                    <Route path="/worklogs/:id" element={
                      <ProtectedRoute>
                        <WorkLogDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/worklogs/:id/edit" element={
                      <ProtectedRoute>
                        <WorkLogEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="/blank-worksheets" element={
                      <ProtectedRoute>
                        <BlankWorkSheets />
                      </ProtectedRoute>
                    } />
                    <Route path="/blank-worksheets/new" element={
                      <ProtectedRoute>
                        <BlankWorkSheetNew />
                      </ProtectedRoute>
                    } />
                    <Route path="/blank-worksheets/:id" element={
                      <ProtectedRoute>
                        <BlankWorkSheetDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/blank-worksheets/:id/edit" element={
                      <ProtectedRoute>
                        <BlankWorkSheetEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    {/* Toutes les routes Settings donnent vers la même page */}
                    <Route path="/settings/personnel" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings/teams" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings/custom-tasks" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings/company" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
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
