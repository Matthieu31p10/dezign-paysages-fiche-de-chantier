import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface NotificationPreferences {
  email?: boolean;
  browser?: boolean;
  reminders?: boolean;
  [key: string]: unknown;
}

export interface UserPreferences {
  theme?: string;
  language?: string;
  [key: string]: unknown;
}

export interface AppConfiguration {
  customTasks?: Array<{ id: string; name: string }>;
  personnel?: Array<{ id: string; name: string; position?: string; active?: boolean }>;
  [key: string]: unknown;
}

export interface SupabaseSettings {
  id?: string;
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  company_logo?: string;
  company_manager_name?: string;
  login_background_image?: string;
  hourly_rate?: number;
  vat_rate?: string;
  default_work_start_time?: string;
  default_work_end_time?: string;
  default_break_time?: string;
  auto_save_enabled?: boolean;
  theme_preference?: string;
  notification_preferences?: Json;
  user_preferences?: Json;
  app_configuration?: Json;
  created_at?: string;
  updated_at?: string;
}

export const useSupabaseSettings = () => {
  const [settings, setSettings] = useState<SupabaseSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from Supabase
  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setSettings(data);
      }
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error loading settings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Save settings to Supabase
  const saveSettings = async (newSettings: Partial<SupabaseSettings>) => {
    try {
      // Check if settings exist
      const { data: existingData } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .single();

      let result;
      if (existingData?.id) {
        // Update existing settings
        result = await supabase
          .from('settings')
          .update(newSettings)
          .eq('id', existingData.id)
          .select()
          .single();
      } else {
        // Insert new settings
        result = await supabase
          .from('settings')
          .insert(newSettings)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      setSettings(result.data);
      toast.success('Paramètres sauvegardés avec succès');
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
      throw error;
    }
  };

  // Update specific setting
  const updateSetting = async (key: keyof SupabaseSettings, value: unknown) => {
    await saveSettings({ [key]: value });
  };

  // Update user preferences
  const updateUserPreferences = async (preferences: Record<string, unknown>) => {
    const currentPrefs = (settings.user_preferences as Record<string, unknown>) || {};
    const newPrefs = { ...currentPrefs, ...preferences };
    await updateSetting('user_preferences', newPrefs as Json);
  };

  // Update app configuration
  const updateAppConfiguration = async (config: Record<string, unknown>) => {
    const currentConfig = (settings.app_configuration as Record<string, unknown>) || {};
    const newConfig = { ...currentConfig, ...config };
    await updateSetting('app_configuration', newConfig as Json);
  };

  // Update notification preferences
  const updateNotificationPreferences = async (preferences: Record<string, unknown>) => {
    const currentNotifs = (settings.notification_preferences as Record<string, unknown>) || {};
    const newNotifs = { ...currentNotifs, ...preferences };
    await updateSetting('notification_preferences', newNotifs as Json);
  };

  // Real-time subscription to settings changes
  useEffect(() => {
    loadSettings();

    const channel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'settings'
        },
        (payload) => {
          console.log('Settings changed:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setSettings(payload.new as SupabaseSettings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    settings,
    loading,
    error,
    loadSettings,
    saveSettings,
    updateSetting,
    updateUserPreferences,
    updateAppConfiguration,
    updateNotificationPreferences
  };
};