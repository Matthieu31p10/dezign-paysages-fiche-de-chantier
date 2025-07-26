import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User, UserRole } from '@/types/models';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users from Supabase profiles
  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('first_name');

      if (error) throw error;

      const mappedUsers: User[] = (data || []).map(profile => ({
        id: profile.id,
        username: profile.email || '',
        password: '', // Don't expose password
        role: (profile.role || 'user') as UserRole,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: profile.email || '',
        phone: '',
        position: '',
        drivingLicense: '',
        createdAt: new Date(profile.created_at || Date.now()),
        permissions: (profile.permissions || {}) as Record<string, boolean>
      }));

      setUsers(mappedUsers);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error loading users:', error);
      setError(error.message);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Update user permissions
  const updateUserPermissions = async (userId: string, permissions: Record<string, boolean>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ permissions })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, permissions }
            : user
        )
      );
      toast.success('Permissions mises à jour avec succès');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error updating user permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
      throw error;
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, role: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, role: role as any }
            : user
        )
      );
      toast.success('Rôle mis à jour avec succès');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error updating user role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
      throw error;
    }
  };

  // Real-time subscription to profile changes
  useEffect(() => {
    loadUsers();

    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile changed:', payload);
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const profile = payload.new;
            const mappedUser: User = {
              id: profile.id,
              username: profile.email || '',
              password: '',
              role: (profile.role || 'user') as UserRole,
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
              email: profile.email || '',
              phone: '',
              position: '',
              drivingLicense: '',
              createdAt: new Date(profile.created_at || Date.now()),
              permissions: (profile.permissions || {}) as Record<string, boolean>
            };

            if (payload.eventType === 'INSERT') {
              setUsers(prev => [...prev, mappedUser]);
            } else {
              setUsers(prev => 
                prev.map(user => user.id === mappedUser.id ? mappedUser : user)
              );
            }
          } else if (payload.eventType === 'DELETE') {
            setUsers(prev => prev.filter(user => user.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    users,
    loading,
    error,
    loadUsers,
    updateUserPermissions,
    updateUserRole
  };
};