
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SettingsContextType } from '../types';
import { Settings, Personnel } from '@/types/models';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Vertos Chantiers',
    companyLogo: '',
    loginBackgroundImage: '',
    companyAddress: '',
    companyManagerName: '',
    companyPhone: '',
    companyEmail: '',
    personnel: [],
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

  // Update local state when data changes
  useEffect(() => {
    const newSettings: Settings = {
      companyName: settingsData?.company_name || 'Vertos Chantiers',
      companyLogo: settingsData?.company_logo || '',
      loginBackgroundImage: settingsData?.login_background_image || '',
      companyAddress: settingsData?.company_address || '',
      companyManagerName: settingsData?.company_manager_name || '',
      companyPhone: settingsData?.company_phone || '',
      companyEmail: settingsData?.company_email || '',
      personnel: personnelData?.map(p => ({
        id: p.id,
        name: p.name,
        position: p.position || '',
        active: p.active !== false,
      })) || [],
    };
    setSettings(newSettings);
  }, [settingsData, personnelData]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<Settings>) => {
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          company_name: newSettings.companyName,
          company_logo: newSettings.companyLogo,
          login_background_image: newSettings.loginBackgroundImage,
          company_address: newSettings.companyAddress,
          company_manager_name: newSettings.companyManagerName,
          company_phone: newSettings.companyPhone,
          company_email: newSettings.companyEmail,
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
    mutationFn: async (personnel: Omit<Personnel, 'id'>) => {
      const { data, error } = await supabase
        .from('personnel')
        .insert([{
          name: personnel.name,
          position: personnel.position,
          active: personnel.active,
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

  const updateSettings = (newSettings: Partial<Settings>) => {
    updateSettingsMutation.mutate(newSettings);
  };

  const addPersonnel = (personnel: Omit<Personnel, 'id'>) => {
    addPersonnelMutation.mutate(personnel);
  };

  const updatePersonnel = (personnel: Personnel) => {
    updatePersonnelMutation.mutate(personnel);
  };

  const deletePersonnel = (id: string) => {
    deletePersonnelMutation.mutate(id);
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
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
