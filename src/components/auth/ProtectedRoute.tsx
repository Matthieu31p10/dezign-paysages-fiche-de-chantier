
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types/models';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  requiredModule?: string;
}

const ProtectedRoute = ({ requiredRole = 'user', requiredModule }: ProtectedRouteProps) => {
  const { auth, canUserAccess } = useApp();
  const location = useLocation();

  // Check if the user is authenticated
  if (!auth.isAuthenticated) {
    // Redirect to the login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has the required role
  if (requiredRole && !canUserAccess(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If specific module access is required, check that too
  if (requiredModule) {
    // This is where we would check module-specific permissions
    // For now, we're just using role-based permissions
    const hasAccess = auth.currentUser?.role === 'admin' || 
                     (auth.currentUser?.role === 'manager') ||
                     (requiredModule === 'projects' || requiredModule === 'worklogs' || requiredModule === 'blanksheets');
                     
    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If the user is authenticated and has the required role and module access, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
