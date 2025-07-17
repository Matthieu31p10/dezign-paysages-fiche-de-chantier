import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DashboardMetrics = {
  totalProjects: number;
  activeProjects: number;
  totalWorkLogs: number;
  totalHours: number;
  totalRevenue: number;
  averageHoursPerProject: number;
};

export type ProjectStats = {
  projectName: string;
  totalHours: number;
  totalWorkLogs: number;
  revenue: number;
};

export type MonthlyStats = {
  month: string;
  hours: number;
  revenue: number;
  workLogs: number;
};

export type PersonnelStats = {
  name: string;
  totalHours: number;
  totalWorkLogs: number;
};

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProjects: 0,
    activeProjects: 0,
    totalWorkLogs: 0,
    totalHours: 0,
    totalRevenue: 0,
    averageHoursPerProject: 0,
  });
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [personnelStats, setPersonnelStats] = useState<PersonnelStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch overall metrics
      await Promise.all([
        fetchOverallMetrics(),
        fetchProjectStats(),
        fetchMonthlyStats(),
        fetchPersonnelStats()
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erreur lors du chargement des données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const fetchOverallMetrics = async () => {
    const [projectsResult, workLogsResult] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact' }),
      supabase
        .from('work_logs')
        .select('total_hours, hourly_rate, is_archived')
        .eq('is_archived', false)
    ]);

    if (projectsResult.error) throw projectsResult.error;
    if (workLogsResult.error) throw workLogsResult.error;

    const totalProjects = projectsResult.count || 0;
    const activeProjects = projectsResult.data?.filter(p => !p.is_archived).length || 0;
    const workLogs = workLogsResult.data || [];
    
    const totalWorkLogs = workLogs.length;
    const totalHours = workLogs.reduce((sum, log) => sum + (log.total_hours || 0), 0);
    const totalRevenue = workLogs.reduce((sum, log) => {
      const rate = log.hourly_rate || 45; // default rate
      return sum + (log.total_hours || 0) * rate;
    }, 0);

    const averageHoursPerProject = totalProjects > 0 ? totalHours / totalProjects : 0;

    setMetrics({
      totalProjects,
      activeProjects,
      totalWorkLogs,
      totalHours,
      totalRevenue,
      averageHoursPerProject,
    });
  };

  const fetchProjectStats = async () => {
    const { data, error } = await supabase
      .from('work_logs')
      .select(`
        total_hours,
        hourly_rate,
        project_id,
        projects (
          name
        )
      `)
      .eq('is_archived', false);

    if (error) throw error;

    const projectMap = new Map<string, { hours: number; count: number; revenue: number }>();

    data?.forEach(log => {
      const projectName = (log.projects as any)?.name || 'Projet sans nom';
      const hours = log.total_hours || 0;
      const rate = log.hourly_rate || 45;
      const revenue = hours * rate;

      if (projectMap.has(projectName)) {
        const existing = projectMap.get(projectName)!;
        projectMap.set(projectName, {
          hours: existing.hours + hours,
          count: existing.count + 1,
          revenue: existing.revenue + revenue,
        });
      } else {
        projectMap.set(projectName, { hours, count: 1, revenue });
      }
    });

    const stats: ProjectStats[] = Array.from(projectMap.entries()).map(([name, data]) => ({
      projectName: name,
      totalHours: data.hours,
      totalWorkLogs: data.count,
      revenue: data.revenue,
    }));

    stats.sort((a, b) => b.totalHours - a.totalHours);
    setProjectStats(stats.slice(0, 10)); // Top 10 projects
  };

  const fetchMonthlyStats = async () => {
    const { data, error } = await supabase
      .from('work_logs')
      .select('date, total_hours, hourly_rate')
      .eq('is_archived', false)
      .order('date', { ascending: true });

    if (error) throw error;

    const monthMap = new Map<string, { hours: number; revenue: number; count: number }>();

    data?.forEach(log => {
      const date = new Date(log.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const hours = log.total_hours || 0;
      const rate = log.hourly_rate || 45;
      const revenue = hours * rate;

      if (monthMap.has(monthKey)) {
        const existing = monthMap.get(monthKey)!;
        monthMap.set(monthKey, {
          hours: existing.hours + hours,
          revenue: existing.revenue + revenue,
          count: existing.count + 1,
        });
      } else {
        monthMap.set(monthKey, { hours, revenue, count: 1 });
      }
    });

    const stats: MonthlyStats[] = Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      hours: data.hours,
      revenue: data.revenue,
      workLogs: data.count,
    }));

    stats.sort((a, b) => a.month.localeCompare(b.month));
    setMonthlyStats(stats.slice(-12)); // Last 12 months
  };

  const fetchPersonnelStats = async () => {
    const { data, error } = await supabase
      .from('work_logs')
      .select('total_hours, personnel')
      .eq('is_archived', false);

    if (error) throw error;

    const personnelMap = new Map<string, { hours: number; count: number }>();

    data?.forEach(log => {
      const personnel = log.personnel || [];
      const hours = log.total_hours || 0;
      const hoursPerPerson = personnel.length > 0 ? hours / personnel.length : 0;

      personnel.forEach((person: string) => {
        if (personnelMap.has(person)) {
          const existing = personnelMap.get(person)!;
          personnelMap.set(person, {
            hours: existing.hours + hoursPerPerson,
            count: existing.count + 1,
          });
        } else {
          personnelMap.set(person, { hours: hoursPerPerson, count: 1 });
        }
      });
    });

    const stats: PersonnelStats[] = Array.from(personnelMap.entries()).map(([name, data]) => ({
      name,
      totalHours: data.hours,
      totalWorkLogs: data.count,
    }));

    stats.sort((a, b) => b.totalHours - a.totalHours);
    setPersonnelStats(stats.slice(0, 10)); // Top 10 personnel
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    metrics,
    projectStats,
    monthlyStats,
    personnelStats,
    loading,
    refetch: fetchDashboardData,
  };
};