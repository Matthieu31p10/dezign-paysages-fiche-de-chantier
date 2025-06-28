
/**
 * Utilitaires de sécurité pour l'application
 */

// Validation des emails
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation des mots de passe
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
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
