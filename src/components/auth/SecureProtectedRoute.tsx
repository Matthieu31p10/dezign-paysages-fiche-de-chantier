import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { ReactElement } from 'react';

interface SecureProtectedRouteProps {
  element?: ReactElement;
}

const SecureProtectedRoute = ({ element }: SecureProtectedRouteProps) => {
  const { user, loading } = useSupabaseAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Check if the user is authenticated
  if (!user) {
    // Redirect to the login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If an element is provided, return it
  if (element) {
    return element;
  }

  // Otherwise, render the child routes
  return <Outlet />;
};

export default SecureProtectedRoute;
