
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SessionData {
  sessionExpiry: string;
  [key: string]: any;
}

const SessionManager = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkClientSession = () => {
      const sessionData = localStorage.getItem('clientSession');
      
      if (sessionData) {
        try {
          const session: SessionData = JSON.parse(sessionData);
          
          // Vérifier l'expiration de la session
          if (new Date() > new Date(session.sessionExpiry)) {
            localStorage.removeItem('clientSession');
            toast.error('Session expirée, veuillez vous reconnecter');
            navigate('/login');
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de session:', error);
          localStorage.removeItem('clientSession');
          navigate('/login');
        }
      }
    };

    // Vérifier la session toutes les 5 minutes
    const interval = setInterval(checkClientSession, 5 * 60 * 1000);
    
    // Vérification initiale
    checkClientSession();

    return () => clearInterval(interval);
  }, [navigate]);

  return <>{children}</>;
};

export default SessionManager;
