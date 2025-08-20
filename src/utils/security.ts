
/**
 * Utilitaires de sécurité pour l'application
 */

// Validation des emails
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation renforcée des mots de passe (conformité ANSSI/CNIL)
export const isValidPassword = (password: string): boolean => {
  // Au moins 12 caractères (recommandation ANSSI renforcée)
  if (password.length < 12) return false;
  
  // Au moins une majuscule
  if (!/[A-Z]/.test(password)) return false;
  
  // Au moins une minuscule  
  if (!/[a-z]/.test(password)) return false;
  
  // Au moins un chiffre
  if (!/\d/.test(password)) return false;
  
  // Au moins un caractère spécial étendu
  if (!/[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\\/~`]/.test(password)) return false;
  
  // Pas de séquences répétitives (AAA, BBB, etc.)
  if (/(.)\1{2,}/.test(password)) return false;
  
  // Pas de séquences clavier communes
  const commonSequences = ['123456', 'abcdef', 'qwerty', 'azerty', 'password', 'motdepasse'];
  const lowerPassword = password.toLowerCase();
  for (const seq of commonSequences) {
    if (lowerPassword.includes(seq)) return false;
  }
  
  return true;
};

// Vérification avancée de la force du mot de passe
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;
  
  // Longueur (critères renforcés)
  if (password.length >= 12) score += 2;
  if (password.length >= 16) score += 2;
  if (password.length >= 20) score += 1;
  
  // Complexité des caractères
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\\/~`]/.test(password)) score += 2;
  
  // Diversité (bonus pour mélange de types)
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\\/~`]/.test(password);
  const diversity = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
  if (diversity >= 4) score += 2;
  
  // Pénalités pour faiblesses
  if (/(.)\1{2,}/.test(password)) score -= 2; // Répétitions
  if (/123456|abcdef|qwerty|azerty|password|motdepasse/i.test(password)) score -= 3;
  
  // Classification sécurisée
  if (score < 6) return 'weak';
  if (score < 10) return 'medium';
  return 'strong';
};

// Sanitisation des entrées utilisateur
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"']/g, '');
};

// Validation des IDs UUID
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Hashage sécurisé des mots de passe (pour usage futur)
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Vérification des permissions client
export const validateClientAccess = (clientSession: any, projectId: string): boolean => {
  if (!clientSession || !clientSession.assignedProjects) {
    return false;
  }
  return clientSession.assignedProjects.includes(projectId);
};

// Détection de tentatives de brute force
export const checkBruteForce = (attempts: number, lastAttempt: Date): boolean => {
  const maxAttempts = 5;
  const lockoutTime = 15 * 60 * 1000; // 15 minutes
  
  if (attempts >= maxAttempts) {
    const timeSinceLastAttempt = Date.now() - lastAttempt.getTime();
    return timeSinceLastAttempt < lockoutTime;
  }
  
  return false;
};

// Validation des tokens de session
export const validateSessionToken = (token: string): boolean => {
  if (!token || token.length < 32) return false;
  
  // Vérifier le format du token
  const tokenRegex = /^[a-zA-Z0-9+/]+=*$/;
  return tokenRegex.test(token);
};

// Nettoyage sécurisé des données sensibles
export const sanitizeSensitiveData = (data: any): any => {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'private'];
  const cleaned = { ...data };
  
  for (const field of sensitiveFields) {
    if (cleaned[field]) {
      cleaned[field] = '***REDACTED***';
    }
  }
  
  return cleaned;
};
