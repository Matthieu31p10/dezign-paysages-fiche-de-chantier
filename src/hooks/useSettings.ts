import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Settings = {
  id: string;
  company_name?: string;
  company_logo?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  company_manager_name?: string;
  hourly_rate?: number;
  vat_rate?: string;
  default_work_start_time?: string;
  default_work_end_time?: string;
  default_break_time?: string;
  theme_preference?: string;
  login_background_image?: string;
  auto_save_enabled?: boolean;
  notification_preferences?: any;
  user_preferences?: any;
  app_configuration?: any;
  created_at?: string;
  updated_at?: string;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    id: '',
    hourly_rate: 45,
    vat_rate: '20',
    default_work_start_time: '08:00',
    default_work_end_time: '17:00',
    default_break_time: '30',
    theme_preference: 'system',
    auto_save_enabled: true,
    notification_preferences: { email: true, browser: true, reminders: true },
    user_preferences: {},
    app_configuration: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .insert({
          hourly_rate: 45,
          vat_rate: '20',
          default_work_start_time: '08:00',
          default_work_end_time: '17:00',
          default_break_time: '30',
          theme_preference: 'system',
          auto_save_enabled: true,
          notification_preferences: { email: true, browser: true, reminders: true },
          user_preferences: {},
          app_configuration: {}
        })
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error creating default settings:', error);
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      
      setSettings(data);
      toast.success('Paramètres mis à jour');
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
};