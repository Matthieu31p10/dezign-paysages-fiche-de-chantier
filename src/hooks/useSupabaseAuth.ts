import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isValidPassword, getPasswordStrength } from '@/utils/security';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
        });

        if (event === 'SIGNED_IN') {
          toast.success('Connexion réussie');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Déconnexion réussie');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => {
    try {
      // Validation renforcée du mot de passe
      if (!isValidPassword(password)) {
        throw new Error('Le mot de passe ne respecte pas les critères de sécurité requis');
      }

      const strength = getPasswordStrength(password);
      if (strength === 'weak') {
        throw new Error('Le mot de passe est trop faible. Utilisez au moins 12 caractères avec majuscules, minuscules, chiffres et caractères spéciaux');
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: userData?.firstName || '',
            last_name: userData?.lastName || '',
            role: 'user',
            permissions: {
              projects: true,
              worklogs: true,
              blanksheets: true
            }
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Un compte existe déjà avec cette adresse email');
        }
        if (error.message.includes('Password should be')) {
          throw new Error('Le mot de passe ne respecte pas les exigences de sécurité');
        }
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Identifiants invalides');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Veuillez confirmer votre email avant de vous connecter');
        }
        if (error.message.includes('Too many requests')) {
          throw new Error('Trop de tentatives de connexion. Veuillez patienter avant de réessayer');
        }
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      // Validation renforcée du nouveau mot de passe
      if (!isValidPassword(newPassword)) {
        throw new Error('Le nouveau mot de passe ne respecte pas les critères de sécurité requis');
      }

      const strength = getPasswordStrength(newPassword);
      if (strength === 'weak') {
        throw new Error('Le nouveau mot de passe est trop faible');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Vérifier si MFA est activé
  const checkMFAStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      
      return {
        isEnabled: data.all.length > 0,
        factors: data.all
      };
    } catch (error: any) {
      console.error('Erreur lors de la vérification du statut MFA:', error);
      return { isEnabled: false, factors: [] };
    }
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    checkMFAStatus,
  };
};