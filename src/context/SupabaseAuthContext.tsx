import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { toast } from '@/hooks/use-toast'
import { useCreateDefaultAdmin } from '@/hooks/useCreateDefaultAdmin'

interface Profile {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  role: 'user' | 'manager' | 'admin'
  permissions: Record<string, boolean>
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  isAuthenticated: boolean
  hasRole: (role: 'user' | 'manager' | 'admin') => boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Create default admin if none exists
  useCreateDefaultAdmin()

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Defer profile fetching with setTimeout to prevent deadlock
          setTimeout(() => {
            fetchProfile(session.user.id)
          }, 0)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id)
        }, 0)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        setProfile(data as Profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: 'Erreur de connexion',
          description: error.message,
          variant: 'destructive',
        })
      }

      return { error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true)
      const redirectUrl = `${window.location.origin}/`
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata || {}
        }
      })

      if (error) {
        toast({
          title: 'Erreur d\'inscription',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Inscription réussie',
          description: 'Vérifiez votre email pour confirmer votre compte',
        })
      }

      return { error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast({
          title: 'Erreur de déconnexion',
          description: error.message,
          variant: 'destructive',
        })
      }

      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) {
        return { error: new Error('User not authenticated') }
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        toast({
          title: 'Erreur de mise à jour',
          description: error.message,
          variant: 'destructive',
        })
        return { error }
      }

      // Refresh profile
      await fetchProfile(user.id)
      
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été mises à jour avec succès',
      })

      return { error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { error }
    }
  }

  const isAuthenticated = Boolean(user && session)
  
  const hasRole = (role: 'user' | 'manager' | 'admin') => {
    if (!profile) return false
    
    // Admin has access to everything
    if (profile.role === 'admin') return true
    
    // Check specific role
    return profile.role === role
  }

  const hasPermission = (permission: string) => {
    if (!profile) return false
    
    // Admin has all permissions
    if (profile.role === 'admin') return true
    
    // Check specific permission
    return Boolean(profile.permissions?.[permission])
  }

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated,
    hasRole,
    hasPermission,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}