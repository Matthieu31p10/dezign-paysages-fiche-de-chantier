
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types/models';
import { ReactElement, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  requiredModule?: string;
  element?: ReactElement;
}

const ProtectedRoute = ({ requiredRole = 'user', requiredModule, element }: ProtectedRouteProps) => {
  const { auth, canUserAccess } = useApp();
  const location = useLocation();

  // Vérifier la connectivité à Supabase quand l'utilisateur accède à des routes protégées
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { error } = await supabase.from('settings').select('id').limit(1);
        if (error) {
          console.error("Erreur de connexion à Supabase:", error);
          toast.error("Problème de connexion à la base de données", {
            description: "Certaines fonctionnalités pourraient ne pas fonctionner correctement"
          });
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la connexion:", err);
      }
    };
    
    checkSupabaseConnection();
  }, [location.pathname]);

  // Vérifier si l'utilisateur est authentifié
  if (!auth.isAuthenticated) {
    // Rediriger vers la page de connexion, mais sauvegarder l'emplacement actuel
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur a le rôle requis
  if (requiredRole && !canUserAccess(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si l'accès à un module spécifique est requis, vérifier cela aussi
  if (requiredModule) {
    // C'est ici que nous vérifierions les autorisations spécifiques au module
    // Pour l'instant, nous utilisons simplement des autorisations basées sur le rôle
    const hasAccess = auth.currentUser?.role === 'admin' || 
                     (auth.currentUser?.role === 'manager') ||
                     (requiredModule === 'projects' || requiredModule === 'worklogs' || requiredModule === 'blanksheets');
                     
    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si un élément est fourni, le retourner
  if (element) {
    return element;
  }

  // Sinon, rendre les routes enfants
  return <Outlet />;
};

export default ProtectedRoute;
