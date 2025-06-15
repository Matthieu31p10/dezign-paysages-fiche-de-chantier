
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { ProjectsProvider } from '@/context/ProjectsContext';
import { WorkLogsProvider } from '@/context/WorkLogsContext/WorkLogsContext';
import { BlankWorksheetsProvider } from '@/context/BlankWorksheetsContext/BlankWorksheetsContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Home';
import Projects from '@/pages/Projects';
import ProjectNew from '@/pages/ProjectNew';
import ProjectDetail from '@/pages/ProjectDetail';
import ProjectEdit from '@/pages/ProjectEdit';
import WorkLogs from '@/pages/WorkLogs';
import WorkLogNew from '@/pages/WorkLogNew';
import WorkLogDetail from '@/pages/WorkLogDetail';
import WorkLogEdit from '@/pages/WorkLogEdit';
import BlankWorkSheets from '@/pages/BlankWorkSheets';
import BlankWorkSheetNew from '@/pages/BlankWorkSheetNew';
import BlankWorkSheetDetail from '@/pages/BlankWorkSheetDetail';
import BlankWorkSheetEdit from '@/pages/BlankWorkSheetEdit';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import SettingsPersonnel from '@/pages/Settings';
import SettingsTeams from '@/pages/Settings';
import SettingsCustomTasks from '@/pages/Settings';
import SettingsCompany from '@/pages/Settings';
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
                          <Layout>
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="/projects" element={<Projects />} />
                              <Route path="/projects/new" element={<ProjectNew />} />
                              <Route path="/projects/:id" element={<ProjectDetail />} />
                              <Route path="/projects/:id/edit" element={<ProjectEdit />} />
                              <Route path="/worklogs" element={<WorkLogs />} />
                              <Route path="/worklogs/new" element={<WorkLogNew />} />
                              <Route path="/worklogs/:id" element={<WorkLogDetail />} />
                              <Route path="/worklogs/:id/edit" element={<WorkLogEdit />} />
                              <Route path="/blank-worksheets" element={<BlankWorkSheets />} />
                              <Route path="/blank-worksheets/new" element={<BlankWorkSheetNew />} />
                              <Route path="/blank-worksheets/:id" element={<BlankWorkSheetDetail />} />
                              <Route path="/blank-worksheets/:id/edit" element={<BlankWorkSheetEdit />} />
                              <Route path="/reports" element={<Reports />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/settings/personnel" element={<SettingsPersonnel />} />
                              <Route path="/settings/teams" element={<SettingsTeams />} />
                              <Route path="/settings/custom-tasks" element={<SettingsCustomTasks />} />
                              <Route path="/settings/company" element={<SettingsCompany />} />
                            </Routes>
                          </Layout>
                        </ProtectedRoute>
                      }
                    />
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
