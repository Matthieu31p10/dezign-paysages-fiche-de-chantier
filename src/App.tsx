
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import Login from '@/components/auth/Login';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Settings from '@/pages/Settings';
import Projects from '@/pages/Projects';
import ProjectNew from '@/pages/ProjectNew';
import ProjectEdit from '@/pages/ProjectEdit';
import WorkLogs from '@/pages/WorkLogs';
import WorkLogNew from '@/pages/WorkLogNew';
import WorkLogEdit from '@/pages/WorkLogEdit';
import BlankWorkSheets from '@/pages/BlankWorkSheets';
import BlankWorkSheetNew from '@/pages/BlankWorkSheetNew';
import Reports from '@/pages/Reports';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import Messages from '@/pages/Messages';
import { useAuth } from '@/context/AuthContext';
import HeaderAction from '@/components/messaging/HeaderAction';
import { useEffect } from 'react';

// Import UI customization from settings
import { useSettings } from '@/context/SettingsContext';

function App() {
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();

  // Add HeaderAction to the app
  useEffect(() => {
    const headerActionContainer = document.getElementById('header-action-container');
    if (headerActionContainer && isAuthenticated) {
      // Create a new div for our action
      const actionDiv = document.createElement('div');
      actionDiv.id = 'message-indicator-container';
      headerActionContainer.appendChild(actionDiv);
      
      // Render our HeaderAction into this div
      const root = ReactDOM.createRoot(actionDiv);
      root.render(<HeaderAction />);
      
      // Clean up on unmount
      return () => {
        const container = document.getElementById('message-indicator-container');
        if (container) {
          container.remove();
        }
      };
    }
  }, [isAuthenticated]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route element={<Layout />}>
          <Route index element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
          
          <Route path="/" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'user']} />}>
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<ProjectNew />} />
            <Route path="projects/:id/edit" element={<ProjectEdit />} />
            
            <Route path="worklogs" element={<WorkLogs />} />
            <Route path="worklogs/new" element={<WorkLogNew />} />
            <Route path="worklogs/:id/edit" element={<WorkLogEdit />} />
            
            <Route path="blank-worksheets" element={<BlankWorkSheets />} />
            <Route path="blank-worksheets/new" element={<BlankWorkSheetNew />} />
            
            <Route path="reports" element={<Reports />} />
            
            <Route path="messages" element={<Messages />} />
          </Route>
          
          <Route path="settings" element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
            <Route index element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
      <Toaster />
      <SonnerToaster position="top-right" />
      
      {/* Apply custom styling from settings */}
      {settings.loginBackgroundImage && (
        <style>
          {`
          .login-container::before {
            background-image: url(${settings.loginBackgroundImage}) !important;
          }
          `}
        </style>
      )}
    </>
  );
}

export default App;
