import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  isValidPassword, 
  getPasswordStrength, 
  checkBruteForce, 
  validateSessionToken,
  sanitizeSensitiveData 
} from '@/utils/security';

interface SecurityState {
  loginAttempts: number;
  lastAttempt: Date | null;
  isBlocked: boolean;
  sessionValid: boolean;
}

export const useSecurity = () => {
  const [securityState, setSecurityState] = useState<SecurityState>({
    loginAttempts: 0,
    lastAttempt: null,
    isBlocked: false,
    sessionValid: true
  });

  // Vérifier le statut de sécurité au chargement
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedLastAttempt = localStorage.getItem('lastLoginAttempt');
    
    if (storedAttempts && storedLastAttempt) {
      const attempts = parseInt(storedAttempts);
      const lastAttempt = new Date(storedLastAttempt);
      const isBlocked = checkBruteForce(attempts, lastAttempt);
      
      setSecurityState({
        loginAttempts: attempts,
        lastAttempt,
        isBlocked,
        sessionValid: true
      });
    }
  }, []);

  // Enregistrer une tentative de connexion échouée
  const recordFailedLogin = useCallback(() => {
    const newAttempts = securityState.loginAttempts + 1;
    const now = new Date();
    
    localStorage.setItem('loginAttempts', newAttempts.toString());
    localStorage.setItem('lastLoginAttempt', now.toISOString());
    
    const isBlocked = checkBruteForce(newAttempts, now);
    
    setSecurityState({
      loginAttempts: newAttempts,
      lastAttempt: now,
      isBlocked,
      sessionValid: true
    });

    if (isBlocked) {
      toast.error('Trop de tentatives de connexion. Veuillez attendre 15 minutes.');
    } else if (newAttempts >= 3) {
      toast.warning(`Attention: ${newAttempts} tentatives échouées. ${5 - newAttempts} tentatives restantes.`);
    }
  }, [securityState.loginAttempts]);

  // Réinitialiser les tentatives après une connexion réussie
  const resetLoginAttempts = useCallback(() => {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lastLoginAttempt');
    
    setSecurityState({
      loginAttempts: 0,
      lastAttempt: null,
      isBlocked: false,
      sessionValid: true
    });
  }, []);

  // Valider un mot de passe et retourner des informations détaillées
  const validatePassword = useCallback((password: string) => {
    const isValid = isValidPassword(password);
    const strength = getPasswordStrength(password);
    
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    return {
      isValid,
      strength,
      requirements,
      score: Object.values(requirements).filter(Boolean).length
    };
  }, []);

  // Valider un token de session
  const validateSession = useCallback((token: string) => {
    const isValid = validateSessionToken(token);
    setSecurityState(prev => ({ ...prev, sessionValid: isValid }));
    
    if (!isValid) {
      toast.error('Session invalide. Veuillez vous reconnecter.');
    }
    
    return isValid;
  }, []);

  // Nettoyer les données sensibles pour les logs
  const cleanSensitiveData = useCallback((data: any) => {
    return sanitizeSensitiveData(data);
  }, []);

  // Vérifier si l'utilisateur peut tenter une connexion
  const canAttemptLogin = useCallback(() => {
    if (securityState.isBlocked) {
      const remainingTime = Math.ceil((15 * 60 * 1000 - (Date.now() - (securityState.lastAttempt?.getTime() || 0))) / 1000 / 60);
      toast.error(`Compte bloqué. Réessayez dans ${remainingTime} minutes.`);
      return false;
    }
    return true;
  }, [securityState.isBlocked, securityState.lastAttempt]);

  return {
    // État
    securityState,
    
    // Actions
    recordFailedLogin,
    resetLoginAttempts,
    validatePassword,
    validateSession,
    cleanSensitiveData,
    canAttemptLogin,
    
    // Utilitaires
    getRemainingAttempts: () => Math.max(0, 5 - securityState.loginAttempts),
    getTimeUntilUnblock: () => {
      if (!securityState.isBlocked || !securityState.lastAttempt) return 0;
      return Math.max(0, 15 * 60 * 1000 - (Date.now() - securityState.lastAttempt.getTime()));
    }
  };
};