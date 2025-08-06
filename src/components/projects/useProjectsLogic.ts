import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ProjectInfo } from '@/types/models';

export const useProjectsLogic = () => {
  const navigate = useNavigate();
  const { projectInfos, selectProject, getActiveProjects, getArchivedProjects, teams, workLogs } = useApp();
  
  // States
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('active');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('name');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState<boolean>(false);
  const [advancedFilteredProjects, setAdvancedFilteredProjects] = useState<ProjectInfo[]>([]);
  const [useAdvancedFilters, setUseAdvancedFilters] = useState<boolean>(false);
  const [showDataManager, setShowDataManager] = useState<boolean>(false);
  const [showPerformanceIndicator, setShowPerformanceIndicator] = useState<boolean>(false);

  const activeProjects = getActiveProjects() || [];
  const archivedProjects = getArchivedProjects() || [];

  // Basic filtering logic
  const filterProjects = useCallback((projects: ProjectInfo[], team: string, type: string, searchTerm?: string) => {
    return projects.filter(project => {
      const matchesTeam = team === 'all' || project.team === team;
      const matchesType = type === 'all' || project.projectType === type;
      const matchesSearch = !searchTerm || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.address?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTeam && matchesType && matchesSearch;
    });
  }, []);

  // Sorting logic
  const sortProjects = useCallback((projects: ProjectInfo[], option: string) => {
    return [...projects].sort((a, b) => {
      switch (option) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'team':
          return (a.team || '').localeCompare(b.team || '');
        default:
          return 0;
      }
    });
  }, []);

  // Get filtered and sorted projects
  const getFilteredAndSortedProjects = useCallback(() => {
    const projectsToFilter = activeTab === 'active' ? activeProjects : archivedProjects;
    
    if (useAdvancedFilters && advancedFilteredProjects.length > 0) {
      const filtered = advancedFilteredProjects.filter(project => 
        projectsToFilter.some(p => p.id === project.id)
      );
      return sortProjects(filtered, sortOption);
    }
    
    const filtered = filterProjects(projectsToFilter, selectedTeam, selectedType, search);
    return sortProjects(filtered, sortOption);
  }, [
    activeTab, activeProjects, archivedProjects, useAdvancedFilters, 
    advancedFilteredProjects, sortProjects, filterProjects, 
    selectedTeam, selectedType, search, sortOption
  ]);

  const filteredProjects = getFilteredAndSortedProjects();

  // Handlers
  const handleSelectProject = useCallback((id: string) => {
    selectProject(id);
    navigate('/worklogs/new');
  }, [selectProject, navigate]);
  
  const handleFormSuccess = useCallback(() => {
    setIsFormDialogOpen(false);
  }, []);

  const handleProjectSelection = useCallback((projectId: string, selected: boolean) => {
    setSelectedProjects(prev => 
      selected 
        ? [...prev, projectId]
        : prev.filter(id => id !== projectId)
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedProjects(filteredProjects.map(p => p.id));
  }, [filteredProjects]);

  const handleClearSelection = useCallback(() => {
    setSelectedProjects([]);
    setShowBulkActions(false);
  }, []);

  const handleAdvancedFilterChange = useCallback((filtered: ProjectInfo[]) => {
    setAdvancedFilteredProjects(filtered);
    setUseAdvancedFilters(true);
  }, []);

  const handleAdvancedFilterReset = useCallback(() => {
    setAdvancedFilteredProjects([]);
    setUseAdvancedFilters(false);
  }, []);

  // Bulk actions
  const handleBulkArchive = useCallback(async (projectIds: string[]) => {
    setIsLoading(true);
    try {
      console.log('Archiving projects:', projectIds);
      handleClearSelection();
    } finally {
      setIsLoading(false);
    }
  }, [handleClearSelection]);

  const handleBulkDelete = useCallback(async (projectIds: string[]) => {
    setIsLoading(true);
    try {
      console.log('Deleting projects:', projectIds);
      handleClearSelection();
    } finally {
      setIsLoading(false);
    }
  }, [handleClearSelection]);

  const handleBulkExport = useCallback(async (projectIds: string[]) => {
    console.log('Exporting projects:', projectIds);
  }, []);

  // Effects
  useEffect(() => {
    setShowBulkActions(selectedProjects.length > 0);
  }, [selectedProjects.length]);

  return {
    // Data
    activeProjects,
    archivedProjects,
    filteredProjects,
    teams,
    workLogs,
    projectInfos,
    
    // States
    isFormDialogOpen,
    search,
    selectedType,
    selectedTeam,
    activeTab,
    viewMode,
    sortOption,
    isLoading,
    selectedProjects,
    showBulkActions,
    useAdvancedFilters,
    showDataManager,
    showPerformanceIndicator,
    
    // Setters
    setIsFormDialogOpen,
    setSearch,
    setSelectedType,
    setSelectedTeam,
    setActiveTab,
    setViewMode,
    setSortOption,
    setShowDataManager,
    setShowPerformanceIndicator,
    setShowBulkActions,
    
    // Handlers
    handleSelectProject,
    handleFormSuccess,
    handleProjectSelection,
    handleSelectAll,
    handleClearSelection,
    handleAdvancedFilterChange,
    handleAdvancedFilterReset,
    handleBulkArchive,
    handleBulkDelete,
    handleBulkExport,
  };
};