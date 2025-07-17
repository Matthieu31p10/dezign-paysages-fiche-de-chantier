import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { ReactElement } from 'react';

interface ProtectedRouteProps {
  requiredRole?: string;
  requiredModule?: string;
  element?: ReactElement;
}

const ProtectedRoute = ({ requiredRole = 'user', requiredModule, element }: ProtectedRouteProps) => {
  const { user, profile, loading, canUserAccess } = useSupabaseAuth();
  const location = useLocation();

  // Show loading while auth state is being determined
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  try {
    // Check if the user is authenticated
    if (!user) {
      // Redirect to the login page, but save the current location
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if the user has the required role
    if (requiredRole && !canUserAccess(requiredRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    // If specific module access is required, check that too
    if (requiredModule) {
      const hasAccess = profile?.role === 'admin' || 
                       canUserAccess(requiredModule);
                       
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
