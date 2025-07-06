
import { supabase } from '@/integrations/supabase/client';

export interface MonthlyDistribution {
  id: string;
  projectId: string;
  monthlyVisits: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export const monthlyDistributionService = {
  async getByProjectId(projectId: string): Promise<MonthlyDistribution | null> {
    const { data, error } = await supabase
      .from('monthly_passage_distributions')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching monthly distribution:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      projectId: data.project_id,
      monthlyVisits: (data.monthly_visits as Record<string, number>) || {},
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  async saveDistribution(projectId: string, monthlyVisits: Record<string, number>): Promise<void> {
    const { error } = await supabase
      .from('monthly_passage_distributions')
      .upsert({
        project_id: projectId,
        monthly_visits: monthlyVisits,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'project_id'
      });

    if (error) {
      console.error('Error saving monthly distribution:', error);
      throw error;
    }
  },

  async deleteByProjectId(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('monthly_passage_distributions')
      .delete()
      .eq('project_id', projectId);

    if (error) {
      console.error('Error deleting monthly distribution:', error);
      throw error;
    }
  }
};
