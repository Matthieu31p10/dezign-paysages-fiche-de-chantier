
import { ProjectInfo, WorkLog } from '@/types/models';

// Get project type color class
export const getProjectTypeColorClass = (type: string): string => {
  switch (type) {
    case 'residence':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'particular':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'enterprise':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Get project badge color based on type
export const getProjectTypeBadgeColor = (type: string): string => {
  switch (type) {
    case 'residence':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'particular':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'enterprise':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

// Get project type label
export const getProjectTypeLabel = (type: string): string => {
  switch (type) {
    case 'residence':
      return 'Résidence';
    case 'particular':
      return 'Particulier';
    case 'enterprise':
      return 'Entreprise';
    default:
      return 'Non défini';
  }
};

// Get active projects
export const getActiveProjects = (projects: ProjectInfo[]): ProjectInfo[] => {
  return projects.filter(project => !project.isArchived);
};

// Check if a project should be archived based on end date
export const shouldArchiveProject = (project: ProjectInfo): boolean => {
  if (!project.endDate) return false;
  
  const endDate = new Date(project.endDate);
  const today = new Date();
  
  return endDate < today;
};

// Auto-archive projects that have passed their end date
export const getProjectsWithAutoArchive = (projects: ProjectInfo[]): ProjectInfo[] => {
  return projects.map(project => {
    if (shouldArchiveProject(project) && !project.isArchived) {
      return { ...project, isArchived: true };
    }
    return project;
  });
};
