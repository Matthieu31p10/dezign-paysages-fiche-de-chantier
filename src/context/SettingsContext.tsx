
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, User, Personnel, CustomTask } from '@/types/models';
import { SettingsContextType } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({});
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Load settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .limit(1)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error("Error loading settings:", settingsError);
        } else if (settingsData) {
          setSettings({
            companyName: settingsData.company_name,
            companyLogo: settingsData.company_logo,
            loginBackgroundImage: settingsData.login_background_image,
            companyInfo: {
              name: settingsData.company_name || '',
              address: settingsData.company_address || '',
              managerName: settingsData.company_manager_name || '',
              phone: settingsData.company_phone || '',
              email: settingsData.company_email || ''
            }
          });
        }

        // Load personnel
        const { data: personnelData, error: personnelError } = await supabase
          .from('personnel')
          .select('*')
          .order('name');

        if (personnelError) {
          console.error("Error loading personnel:", personnelError);
        } else {
          const formattedPersonnel: Personnel[] = personnelData.map(p => ({
            id: p.id,
            name: p.name,
            position: p.position,
            active: p.active
          }));
          setPersonnel(formattedPersonnel);
        }

        // Load custom tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('custom_tasks')
          .select('*')
          .order('name');

        if (tasksError) {
          console.error("Error loading custom tasks:", tasksError);
        } else {
          const formattedTasks: CustomTask[] = tasksData.map(t => ({
            id: t.id,
            name: t.name
          }));
          setCustomTasks(formattedTasks);
        }

      } catch (error) {
        console.error("Error loading settings data:", error);
        toast.error("Erreur lors du chargement des paramètres");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const settingsData = {
        company_name: updatedSettings.companyName,
        company_logo: updatedSettings.companyLogo,
        login_background_image: updatedSettings.loginBackgroundImage,
        company_address: updatedSettings.companyInfo?.address,
        company_manager_name: updatedSettings.companyInfo?.managerName,
        company_phone: updatedSettings.companyInfo?.phone,
        company_email: updatedSettings.companyInfo?.email
      };

      const { error } = await supabase
        .from('settings')
        .upsert(settingsData);

      if (error) throw error;

      setSettings(updatedSettings);
      toast.success('Paramètres mis à jour');
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error('Erreur lors de la mise à jour des paramètres');
      throw error;
    }
  };

  const addCustomTask = async (taskName: string) => {
    try {
      const { data, error } = await supabase
        .from('custom_tasks')
        .insert([{ name: taskName }])
        .select()
        .single();

      if (error) throw error;

      const newTask: CustomTask = {
        id: data.id,
        name: data.name
      };

      setCustomTasks((prev) => [...prev, newTask]);
      toast.success('Tâche personnalisée ajoutée');
      return newTask;
    } catch (error) {
      console.error("Error adding custom task:", error);
      toast.error('Erreur lors de l\'ajout de la tâche');
      throw error;
    }
  };

  const deleteCustomTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Tâche personnalisée supprimée');
    } catch (error) {
      console.error("Error deleting custom task:", error);
      toast.error('Erreur lors de la suppression de la tâche');
      throw error;
    }
  };

  const addPersonnel = async (name: string, position?: string) => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .insert([{ name, position, active: true }])
        .select()
        .single();

      if (error) throw error;

      const newPersonnel: Personnel = {
        id: data.id,
        name: data.name,
        position: data.position,
        active: data.active
      };

      setPersonnel((prev) => [...prev, newPersonnel]);
      toast.success('Personnel ajouté');
      return newPersonnel;
    } catch (error) {
      console.error("Error adding personnel:", error);
      toast.error('Erreur lors de l\'ajout du personnel');
      throw error;
    }
  };

  const updatePersonnel = async (updatedPersonnel: Personnel) => {
    try {
      const { error } = await supabase
        .from('personnel')
        .update({
          name: updatedPersonnel.name,
          position: updatedPersonnel.position,
          active: updatedPersonnel.active
        })
        .eq('id', updatedPersonnel.id);

      if (error) throw error;

      setPersonnel((prev) => prev.map((p) => (p.id === updatedPersonnel.id ? updatedPersonnel : p)));
      toast.success('Personnel mis à jour');
    } catch (error) {
      console.error("Error updating personnel:", error);
      toast.error('Erreur lors de la mise à jour du personnel');
      throw error;
    }
  };

  const deletePersonnel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('personnel')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPersonnel((prev) => prev.filter((p) => p.id !== id));
      toast.success('Personnel supprimé');
    } catch (error) {
      console.error("Error deleting personnel:", error);
      toast.error('Erreur lors de la suppression du personnel');
      throw error;
    }
  };

  const togglePersonnelActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('personnel')
        .update({ active: isActive })
        .eq('id', id);

      if (error) throw error;

      setPersonnel((prev) => prev.map((p) => 
        p.id === id ? { ...p, active: isActive } : p
      ));
      toast.success(`Personnel ${isActive ? 'activé' : 'désactivé'}`);
    } catch (error) {
      console.error("Error toggling personnel active status:", error);
      toast.error('Erreur lors de la modification du statut');
      throw error;
    }
  };

  const getPersonnel = () => personnel;
  const getCustomTasks = () => customTasks;

  return (
    <SettingsContext.Provider
      value={{
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
      }}
    >
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
