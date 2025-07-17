
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsViewToggle from '@/components/projects/ProjectsViewToggle';
import ProjectsTabs from '@/components/projects/ProjectsTabs';
import ProjectsEmptyState from '@/components/projects/ProjectsEmptyState';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

const Projects = () => {
  const navigate = useNavigate();
  const { projectInfos, selectProject, getActiveProjects, getArchivedProjects, teams } = useApp();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('active');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const activeProjects = getActiveProjects();
  const archivedProjects = getArchivedProjects();

  const getFilteredProjects = () => {
    const projectsToFilter = activeTab === 'active' ? activeProjects : archivedProjects;
    
    return projectsToFilter.filter(project => {
      // Filter by search term
      const matchesSearch = !search ? true : (
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.address.toLowerCase().includes(search.toLowerCase()) ||
        project.additionalInfo.toLowerCase().includes(search.toLowerCase())
      );
      
      // Filter by project type
      const matchesType = selectedType === 'all' || project.projectType === selectedType;
      
      // Filter by team
      const matchesTeam = selectedTeam === 'all' || project.team === selectedTeam;
      
      return matchesSearch && matchesType && matchesTeam;
    });
  };
  
  const filteredProjects = getFilteredProjects();
  
  const handleSelectProject = (id: string) => {
    selectProject(id);
    navigate('/worklogs/new');
  };
  
  const handleFormSuccess = () => {
    setIsFormDialogOpen(false);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <ProjectsHeader 
        isFormDialogOpen={isFormDialogOpen}
        onFormDialogChange={setIsFormDialogOpen}
        onFormSuccess={handleFormSuccess}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <ProjectsFilters
            search={search}
            onSearchChange={setSearch}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedTeam={selectedTeam}
            onTeamChange={setSelectedTeam}
            teams={teams}
          />
          
          <div className="ml-auto flex items-center gap-2">
            <ProjectsViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            
            <ProjectsTabs
              activeProjectsCount={activeProjects.length}
              archivedProjectsCount={archivedProjects.length}
            />
          </div>
        </div>
        
        <TabsContent value="active" className="mt-0">
          {filteredProjects.length === 0 ? (
            <ProjectsEmptyState
              type="active"
              hasProjects={activeProjects.length > 0}
              onCreateProject={() => setIsFormDialogOpen(true)}
            />
          ) : (
            <ProjectsGrid
              projects={filteredProjects}
              viewMode={viewMode}
              onSelectProject={handleSelectProject}
            />
          )}
        </TabsContent>
        
        <TabsContent value="archived" className="mt-0">
          {filteredProjects.length === 0 ? (
            <ProjectsEmptyState
              type="archived"
              hasProjects={archivedProjects.length > 0}
              onCreateProject={() => setIsFormDialogOpen(true)}
            />
          ) : (
            <ProjectsGrid
              projects={filteredProjects}
              viewMode={viewMode}
              onSelectProject={handleSelectProject}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
