import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { ReactElement } from 'react';
import { PageLoadingFallback } from '@/components/common/LoadingFallback';

interface ProtectedRouteProps {
  element?: ReactElement;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { user, loading } = useSupabaseAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <PageLoadingFallback />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If an element is provided, return it
  if (element) {
    return element;
  }

  // Otherwise, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
