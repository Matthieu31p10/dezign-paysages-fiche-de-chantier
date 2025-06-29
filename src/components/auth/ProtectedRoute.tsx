import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types/models';
import { ReactElement } from 'react';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  requiredModule?: string;
  element?: ReactElement;
}

const ProtectedRoute = ({ requiredRole = 'user', requiredModule, element }: ProtectedRouteProps) => {
  const { auth, canUserAccess } = useApp();
  const location = useLocation();

  try {
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

    // If an element is provided, return it
    if (element) {
      return element;
    }

    // Otherwise, render the child routes
    return <Outlet />;
  } catch (error) {
    console.error('Error in ProtectedRoute:', error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
