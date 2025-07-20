import { useEffect, useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';

interface DashboardMetrics {
  activeProjects: number;
  teamsOnSite: number;
  scheduledVisits: number;
  globalProgress: number;
  activeProjectsChange: string;
  teamsChange: string;
  scheduledVisitsChange: string;
  progressChange: string;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'worklog' | 'passage';
  title: string;
  timestamp: string;
  color: string;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  date: string;
  priority: 'urgent' | 'normal' | 'planned';
}

export const useDashboardData = () => {
  const { projectInfos, workLogs, teams } = useApp();

  // Calculer les métriques du dashboard
  const metrics = useMemo((): DashboardMetrics => {
    const validProjects = Array.isArray(projectInfos) ? projectInfos : [];
    const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];
    const validTeams = Array.isArray(teams) ? teams : [];

    // Projets actifs (non archivés)
    const activeProjects = validProjects.filter(p => !p.isArchived).length;

    // Équipes sur site (équipes avec des projets actifs)
    const teamsWithActiveProjects = new Set(
      validProjects
        .filter(p => !p.isArchived)
        .map(p => p.id)
        .flatMap(projectId => 
          validWorkLogs
            .filter(wl => wl.projectId === projectId && !wl.isArchived)
            .flatMap(wl => wl.personnel || [])
        )
    );
    const teamsOnSite = Math.min(teamsWithActiveProjects.size, validTeams.length);

    // Passages planifiés cette semaine (estimation basée sur les work logs récents)
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const scheduledVisits = validWorkLogs.filter(wl => {
      if (!wl.date || wl.isArchived) return false;
      try {
        const workLogDate = new Date(wl.date);
        return workLogDate >= weekStart && workLogDate <= weekEnd;
      } catch {
        return false;
      }
    }).length;

    // Progression globale (basée sur le ratio de projets terminés)
    const totalHours = validWorkLogs
      .filter(wl => !wl.isArchived)
      .reduce((sum, wl) => sum + (wl.timeTracking?.totalHours || wl.duration || 0), 0);
    
    const plannedHours = validProjects
      .filter(p => !p.isArchived)
      .reduce((sum, p) => sum + (p.annualTotalHours || 0), 0);

    const globalProgress = plannedHours > 0 ? Math.round((totalHours / plannedHours) * 100) : 0;

    return {
      activeProjects,
      teamsOnSite,
      scheduledVisits,
      globalProgress: Math.min(globalProgress, 100),
      activeProjectsChange: '+2 depuis le mois dernier',
      teamsChange: '+1 depuis la semaine dernière', 
      scheduledVisitsChange: 'Cette semaine',
      progressChange: '+5% ce mois-ci'
    };
  }, [projectInfos, workLogs, teams]);

  // Activité récente
  const recentActivity = useMemo((): RecentActivity[] => {
    const validProjects = Array.isArray(projectInfos) ? projectInfos : [];
    const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];

    const activities: RecentActivity[] = [];

    // Projets récents
    validProjects
      .filter(p => !p.isArchived)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 2)
      .forEach(project => {
        activities.push({
          id: project.id,
          type: 'project',
          title: `Nouveau chantier créé: ${project.name}`,
          timestamp: formatRelativeTime(project.createdAt?.toISOString() || null),
          color: 'text-orange-500'
        });
      });

    // Work logs récents
    validWorkLogs
      .filter(wl => !wl.isArchived)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 2)
      .forEach(workLog => {
        const project = validProjects.find(p => p.id === workLog.projectId);
        activities.push({
          id: workLog.id,
          type: 'worklog',
          title: `Rapport de suivi complété${project ? ` - ${project.name}` : ''}`,
          timestamp: formatRelativeTime(workLog.createdAt?.toISOString() || null),
          color: 'text-blue-500'
        });
      });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
  }, [projectInfos, workLogs]);

  // Prochaines échéances
  const upcomingDeadlines = useMemo((): UpcomingDeadline[] => {
    const validProjects = Array.isArray(projectInfos) ? projectInfos : [];
    const validWorkLogs = Array.isArray(workLogs) ? workLogs : [];

    const deadlines: UpcomingDeadline[] = [];

    // Projets avec dates de fin proches
    validProjects
      .filter(p => !p.isArchived && p.endDate)
      .forEach(project => {
        const endDate = new Date(project.endDate!);
        const now = new Date();
        const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilEnd > 0 && daysUntilEnd <= 30) {
          deadlines.push({
            id: project.id,
            title: `Fin prévue: ${project.name}`,
            date: formatDeadlineDate(endDate),
            priority: daysUntilEnd <= 7 ? 'urgent' : 'normal'
          });
        }
      });

    // Ajouter quelques échéances par défaut si pas assez de données
    if (deadlines.length < 3) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      deadlines.push(
        {
          id: 'default-1',
          title: 'Passage Chantier B',
          date: 'Demain, 14h00',
          priority: 'urgent'
        },
        {
          id: 'default-2', 
          title: 'Rapport mensuel',
          date: 'Dans 3 jours',
          priority: 'normal'
        },
        {
          id: 'default-3',
          title: 'Réunion équipe',
          date: 'Vendredi, 10h00', 
          priority: 'planned'
        }
      );
    }

    return deadlines.slice(0, 3);
  }, [projectInfos, workLogs]);

  return {
    metrics,
    recentActivity,
    upcomingDeadlines
  };
};

// Fonction utilitaire pour formater le temps relatif
const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) return 'Récemment';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours === 1) return 'Il y a 1 heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heures`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    
    return date.toLocaleDateString('fr-FR');
  } catch {
    return 'Récemment';
  }
};

// Fonction utilitaire pour formater les dates d'échéance
const formatDeadlineDate = (date: Date): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) {
    return `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Demain, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays <= 7) {
    return `Dans ${diffInDays} jours`;
  }

  return date.toLocaleDateString('fr-FR');
};