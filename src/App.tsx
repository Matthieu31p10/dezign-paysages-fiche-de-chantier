import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { WorkLogsProvider } from './context/WorkLogsContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { SettingsProvider } from './context/SettingsContext';
import { TeamsProvider } from './context/TeamsContext';
import { UsersProvider } from './context/UsersContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import WorkLogs from './pages/WorkLogs';
import Projects from './pages/Projects';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { initializeFirebase } from './firebase';
import './App.css';
import BlankWorkSheetsPage from './pages/blank-worksheets';

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
      const timeoutId = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 300); // match the CSS transition duration
      return () => clearTimeout(timeoutId);
    }
  }, [location, displayLocation]);

  return (
    <div className={`${transitionStage} route-transition`}>
      <Routes location={displayLocation}>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worklogs"
          element={
            <ProtectedRoute>
              <WorkLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worklogs/:id"
          element={
            <ProtectedRoute>
              <WorkLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blank-worksheets"
          element={
            <ProtectedRoute>
              <BlankWorkSheetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    initializeFirebase();
  }, []);

  return (
    <AppProvider>
      <SettingsProvider>
        <TeamsProvider>
          <UsersProvider>
            <ProjectsProvider>
              <WorkLogsProvider>
                <Router>
                  <AppContent />
                </Router>
                <Toaster position="bottom-center" richColors closeButton />
              </WorkLogsProvider>
            </ProjectsProvider>
          </UsersProvider>
        </TeamsProvider>
      </SettingsProvider>
    </AppProvider>
  );
};

export default App;
