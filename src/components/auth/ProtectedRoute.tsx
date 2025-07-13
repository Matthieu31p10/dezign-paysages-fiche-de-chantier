import { useLocation, Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from '@/context/SupabaseAuthContext'
import { LoadingSpinner } from '@/components/loading'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'user' | 'manager' | 'admin'
  requiredPermission?: string
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission 
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading, hasRole, hasPermission } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Vérification de l'authentification..." />
      </div>
    )
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}