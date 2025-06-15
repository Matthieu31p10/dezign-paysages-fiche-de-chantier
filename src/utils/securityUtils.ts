
import { z } from 'zod';

// Validation schemas for security
export const emailSchema = z.string().email('Format d\'email invalide');

export const passwordSchema = z.string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

export const uuidSchema = z.string().uuid('UUID invalide');

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>\"']/g, '') // Remove dangerous characters
    .trim(); // Remove whitespace
};

// Validate and sanitize user input
export const validateAndSanitizeInput = (
  input: string, 
  schema: z.ZodSchema,
  fieldName: string = 'champ'
): { isValid: boolean; sanitized?: string; error?: string } => {
  try {
    const sanitized = sanitizeInput(input);
    schema.parse(sanitized);
    return { isValid: true, sanitized };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: `${fieldName}: ${error.errors[0]?.message || 'Données invalides'}` 
      };
    }
    return { isValid: false, error: `${fieldName}: Format invalide` };
  }
};

// Rate limiting helper (simple in-memory implementation)
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if under limit
    if (userAttempts.count < this.maxAttempts) {
      userAttempts.count++;
      userAttempts.lastAttempt = now;
      return true;
    }

    return false;
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier);
    if (!userAttempts) return 0;
    
    const elapsed = Date.now() - userAttempts.lastAttempt;
    return Math.max(0, this.windowMs - elapsed);
  }
}

export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// Secure logging function that filters sensitive data
export const secureLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    if (data) {
      // Filter out sensitive fields
      const sanitizedData = Object.keys(data).reduce((acc, key) => {
        if (['password', 'token', 'secret', 'key'].some(sensitive => 
          key.toLowerCase().includes(sensitive)
        )) {
          acc[key] = '[REDACTED]';
        } else {
          acc[key] = data[key];
        }
        return acc;
      }, {} as any);
      
      console.log(message, sanitizedData);
    } else {
      console.log(message);
    }
  }
};
