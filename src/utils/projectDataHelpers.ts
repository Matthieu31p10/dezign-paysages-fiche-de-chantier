import { ProjectInfo, WorkLog } from '@/types/models';

// Data transformation utilities
export const projectDataHelpers = {
  // Normalize project data
  normalizeProject: (project: Partial<ProjectInfo>): Partial<ProjectInfo> => {
    return {
      ...project,
      name: project.name?.trim(),
      address: project.address?.trim(),
      clientName: project.clientName?.trim(),
      contactEmail: project.contactEmail?.toLowerCase().trim(),
      contactPhone: project.contactPhone?.replace(/[^\d\+\-\(\)\s]/g, ''),
      annualTotalHours: Number(project.annualTotalHours) || 0,
      annualVisits: Number(project.annualVisits) || 0,
      visitDuration: Number(project.visitDuration) || 0
    };
  },

  // Calculate project statistics
  calculateProjectStats: (project: ProjectInfo, workLogs: WorkLog[]) => {
    const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
    
    const totalActualHours = projectWorkLogs.reduce((sum, log) => 
      sum + (log.timeTracking?.totalHours || 0), 0
    );
    
    const totalVisits = projectWorkLogs.length;
    
    const averageHoursPerVisit = totalVisits > 0 ? totalActualHours / totalVisits : 0;
    
    const lastVisit = projectWorkLogs
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const completionRate = project.annualTotalHours > 0 
      ? (totalActualHours / project.annualTotalHours) * 100 
      : 0;

    return {
      totalActualHours,
      totalVisits,
      averageHoursPerVisit,
      lastVisit: lastVisit?.date || null,
      completionRate: Math.min(completionRate, 100)
    };
  },

  // Generate project summary
  generateProjectSummary: (projects: ProjectInfo[], workLogs: WorkLog[]) => {
    const activeProjects = projects.filter(p => !p.isArchived);
    const archivedProjects = projects.filter(p => p.isArchived);
    
    const totalPlannedHours = projects.reduce((sum, p) => sum + (p.annualTotalHours || 0), 0);
    const totalActualHours = workLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
    
    const projectsByType = projects.reduce((acc, project) => {
      const type = project.projectType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageVisitsPerProject = projects.length > 0 
      ? workLogs.length / projects.length 
      : 0;

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      archivedProjects: archivedProjects.length,
      totalPlannedHours,
      totalActualHours,
      hoursCompletion: totalPlannedHours > 0 ? (totalActualHours / totalPlannedHours) * 100 : 0,
      projectsByType,
      averageVisitsPerProject: Math.round(averageVisitsPerProject * 10) / 10,
      totalWorkLogs: workLogs.length
    };
  },

  // Export project data to different formats
  exportToCSV: (projects: ProjectInfo[], workLogs: WorkLog[]) => {
    const headers = [
      'Nom',
      'Type',
      'Client',
      'Adresse',
      'Téléphone',
      'Email',
      'Heures annuelles',
      'Visites annuelles',
      'Durée de visite',
      'Date de création',
      'Archivé',
      'Heures réalisées',
      'Visites réalisées',
      'Taux de completion'
    ];

    const rows = projects.map(project => {
      const stats = projectDataHelpers.calculateProjectStats(project, workLogs);
      
      return [
        project.name,
        project.projectType || '',
        project.clientName || '',
        project.address,
        project.contactPhone || '',
        project.contactEmail || '',
        project.annualTotalHours || 0,
        project.annualVisits || 0,
        project.visitDuration || 0,
        project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '',
        project.isArchived ? 'Oui' : 'Non',
        stats.totalActualHours,
        stats.totalVisits,
        `${Math.round(stats.completionRate)}%`
      ];
    });

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  },

  // Import project data from CSV
  importFromCSV: (csvContent: string): Partial<ProjectInfo>[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    const projects: Partial<ProjectInfo>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
      
      if (values.length >= headers.length) {
        const project: Partial<ProjectInfo> = {
          id: crypto.randomUUID(),
          name: values[0] || '',
          projectType: (values[1] as any) || undefined,
          clientName: values[2] || undefined,
          address: values[3] || '',
          contactPhone: values[4] || undefined,
          contactEmail: values[5] || undefined,
          annualTotalHours: Number(values[6]) || 0,
          annualVisits: Number(values[7]) || 0,
          visitDuration: Number(values[8]) || 0,
          isArchived: values[10] === 'Oui',
          createdAt: new Date()
        };

        projects.push(projectDataHelpers.normalizeProject(project));
      }
    }

    return projects;
  },

  // Backup project data
  createBackup: (projects: ProjectInfo[], workLogs: WorkLog[]) => {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        projects: projects.map(p => projectDataHelpers.normalizeProject(p)),
        workLogs,
        summary: projectDataHelpers.generateProjectSummary(projects, workLogs)
      }
    };
  },

  // Restore from backup
  restoreFromBackup: (backupData: any): { projects: ProjectInfo[]; workLogs: WorkLog[] } | null => {
    try {
      if (!backupData.data || !backupData.data.projects || !backupData.data.workLogs) {
        throw new Error('Format de sauvegarde invalide');
      }

      return {
        projects: backupData.data.projects,
        workLogs: backupData.data.workLogs
      };
    } catch (error) {
      console.error('Restore error:', error);
      return null;
    }
  },

  // Generate unique project name
  generateUniqueProjectName: (baseName: string, existingProjects: ProjectInfo[]) => {
    const existingNames = existingProjects.map(p => p.name.toLowerCase());
    let uniqueName = baseName;
    let counter = 1;

    while (existingNames.includes(uniqueName.toLowerCase())) {
      uniqueName = `${baseName} (${counter})`;
      counter++;
    }

    return uniqueName;
  },

  // Merge project data
  mergeProjectData: (existing: ProjectInfo, updates: Partial<ProjectInfo>): ProjectInfo => {
    const normalized = projectDataHelpers.normalizeProject(updates);
    
    return {
      ...existing,
      ...normalized,
      id: existing.id, // Preserve original ID
      createdAt: existing.createdAt // Preserve creation date
    };
  }
};