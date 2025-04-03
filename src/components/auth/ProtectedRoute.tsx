
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types/models';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

const ProtectedRoute = ({ requiredRole = 'user' }: ProtectedRouteProps) => {
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

  // If the user is authenticated and has the required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
