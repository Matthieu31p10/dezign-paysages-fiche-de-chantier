
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler({ showToast: false });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log auth events securely (without sensitive data)
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        handleError(error, 'Erreur lors de la vérification de la session');
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [handleError]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Validate input
      if (!email || !password) {
        return { error: 'Email et mot de passe requis' };
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: 'Format d\'email invalide' };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        // Return user-friendly error messages without exposing system details
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Email ou mot de passe incorrect' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Veuillez confirmer votre email avant de vous connecter' };
        }
        return { error: 'Erreur de connexion. Veuillez réessayer.' };
      }

      toast.success('Connexion réussie');
      return {};
    } catch (error) {
      handleError(error as Error, 'Erreur lors de la connexion');
      return { error: 'Erreur de connexion. Veuillez réessayer.' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Validate input
      if (!email || !password) {
        return { error: 'Email et mot de passe requis' };
      }
      
      // Password strength validation
      if (password.length < 8) {
        return { error: 'Le mot de passe doit contenir au moins 8 caractères' };
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: 'Format d\'email invalide' };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        // Return user-friendly error messages
        if (error.message.includes('User already registered')) {
          return { error: 'Un compte existe déjà avec cet email' };
        }
        if (error.message.includes('Password should be at least')) {
          return { error: 'Le mot de passe doit contenir au moins 6 caractères' };
        }
        return { error: 'Erreur lors de la création du compte' };
      }

      toast.success('Compte créé avec succès. Vérifiez votre email pour confirmer votre compte.');
      return {};
    } catch (error) {
      handleError(error as Error, 'Erreur lors de la création du compte');
      return { error: 'Erreur lors de la création du compte' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        handleError(error, 'Erreur lors de la déconnexion');
        toast.error('Erreur lors de la déconnexion');
      } else {
        toast.success('Déconnexion réussie');
      }
    } catch (error) {
      handleError(error as Error, 'Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!email) {
        return { error: 'Email requis' };
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: 'Format d\'email invalide' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { error: 'Erreur lors de l\'envoi de l\'email de réinitialisation' };
      }

      toast.success('Email de réinitialisation envoyé');
      return {};
    } catch (error) {
      handleError(error as Error, 'Erreur lors de la réinitialisation');
      return { error: 'Erreur lors de l\'envoi de l\'email' };
    }
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
