
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSecurity } from '@/hooks/useSecurity';

interface SessionData {
  sessionExpiry: string;
  [key: string]: any;
}

const SessionManager = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { validateSession, cleanSensitiveData } = useSecurity();

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
            return;
          }

          // Validation sécurisée de la session
          if (session.sessionToken && !validateSession(session.sessionToken)) {
            localStorage.removeItem('clientSession');
            navigate('/login');
            return;
          }

          // Vérifier l'intégrité des données de session
          const requiredFields = ['sessionExpiry', 'userId'];
          const missingFields = requiredFields.filter(field => !session[field]);
          
          if (missingFields.length > 0) {
            console.error('Session corrompue - champs manquants:', missingFields);
            localStorage.removeItem('clientSession');
            toast.error('Session corrompue, veuillez vous reconnecter');
            navigate('/login');
            return;
          }

        } catch (error) {
          // Logger l'erreur de manière sécurisée (sans données sensibles)
          console.error('Erreur de session:', cleanSensitiveData(error));
          localStorage.removeItem('clientSession');
          toast.error('Erreur de session, veuillez vous reconnecter');
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
