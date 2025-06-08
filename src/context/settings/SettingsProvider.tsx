
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SettingsContextType } from '../types';
import { AppSettings, Personnel, CustomTask } from '@/types/models';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({
    companyName: 'Vertos Chantiers',
    companyLogo: '',
    loginBackgroundImage: '',
    personnel: [],
    customTasks: [],
  });
  
  const queryClient = useQueryClient();

  // Fetch settings from Supabase
  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  // Fetch personnel from Supabase
  const { data: personnelData } = useQuery({
    queryKey: ['personnel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch custom tasks from Supabase
  const { data: customTasksData } = useQuery({
    queryKey: ['custom_tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Memoize settings to prevent infinite re-renders
  const memoizedSettings = useMemo(() => {
    const newSettings: AppSettings = {
      companyName: settingsData?.company_name || 'Vertos Chantiers',
      companyLogo: settingsData?.company_logo || '',
      loginBackgroundImage: settingsData?.login_background_image || '',
      companyInfo: settingsData ? {
        name: settingsData.company_name || '',
        address: settingsData.company_address || '',
        managerName: settingsData.company_manager_name || '',
        phone: settingsData.company_phone || '',
        email: settingsData.company_email || '',
      } : undefined,
      personnel: personnelData?.map(p => ({
        id: p.id,
        name: p.name,
        position: p.position || '',
        active: p.active !== false,
      })) || [],
      customTasks: customTasksData?.map(t => ({
        id: t.id,
        name: t.name,
      })) || [],
    };
    return newSettings;
  }, [settingsData, personnelData, customTasksData]);

  // Update local state when data changes
  useEffect(() => {
    setSettings(memoizedSettings);
  }, [memoizedSettings]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<AppSettings>) => {
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          company_name: newSettings.companyName,
          company_logo: newSettings.companyLogo,
          login_background_image: newSettings.loginBackgroundImage,
          company_address: newSettings.companyInfo?.address,
          company_manager_name: newSettings.companyInfo?.managerName,
          company_phone: newSettings.companyInfo?.phone,
          company_email: newSettings.companyInfo?.email,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  // Add personnel mutation
  const addPersonnelMutation = useMutation({
    mutationFn: async ({ name, position }: { name: string; position?: string }) => {
      const { data, error } = await supabase
        .from('personnel')
        .insert([{
          name,
          position: position || '',
          active: true,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
    },
  });

  // Update personnel mutation
  const updatePersonnelMutation = useMutation({
    mutationFn: async (personnel: Personnel) => {
      const { data, error } = await supabase
        .from('personnel')
        .update({
          name: personnel.name,
          position: personnel.position,
          active: personnel.active,
        })
        .eq('id', personnel.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
    },
  });

  // Delete personnel mutation
  const deletePersonnelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('personnel')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
    },
  });

  // Add custom task mutation
  const addCustomTaskMutation = useMutation({
    mutationFn: async (taskName: string) => {
      const { data, error } = await supabase
        .from('custom_tasks')
        .insert([{ name: taskName }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_tasks'] });
    },
  });

  // Delete custom task mutation
  const deleteCustomTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_tasks'] });
    },
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    updateSettingsMutation.mutate(newSettings);
  };

  const addPersonnel = (name: string, position?: string) => {
    const newPersonnel: Personnel = {
      id: crypto.randomUUID(),
      name,
      position: position || '',
      active: true,
    };
    addPersonnelMutation.mutate({ name, position });
    return newPersonnel;
  };

  const updatePersonnel = (personnel: Personnel) => {
    updatePersonnelMutation.mutate(personnel);
  };

  const deletePersonnel = (id: string) => {
    deletePersonnelMutation.mutate(id);
  };

  const addCustomTask = (taskName: string) => {
    const newTask: CustomTask = {
      id: crypto.randomUUID(),
      name: taskName,
    };
    addCustomTaskMutation.mutate(taskName);
    return newTask;
  };

  const deleteCustomTask = (id: string) => {
    deleteCustomTaskMutation.mutate(id);
  };

  const getPersonnel = () => {
    return settings.personnel || [];
  };

  const togglePersonnelActive = (id: string, isActive: boolean) => {
    const personnel = getPersonnel().find(p => p.id === id);
    if (personnel) {
      updatePersonnel({ ...personnel, active: isActive });
    }
  };

  const getCustomTasks = () => {
    return settings.customTasks || [];
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    addCustomTask,
    deleteCustomTask,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    getPersonnel,
    togglePersonnelActive,
    getCustomTasks,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
