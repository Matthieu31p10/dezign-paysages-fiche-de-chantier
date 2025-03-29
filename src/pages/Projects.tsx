
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectListView from '@/components/projects/ProjectListView';
import ProjectForm from '@/components/projects/ProjectForm';
import { Plus, FileText, Search, Building2, Home, Landmark, Archive, LayoutGrid, LayoutList } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const { projectInfos, selectProject, getActiveProjects, getArchivedProjects } = useApp();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
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
      
      return matchesSearch && matchesType;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Fiches chantier</h1>
          <p className="text-muted-foreground">
            Gérez vos fiches d'informations chantier
          </p>
        </div>
        
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau chantier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle fiche chantier</DialogTitle>
            </DialogHeader>
            <ProjectForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un chantier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Type de chantier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="residence">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-green-500" />
                    <span>Résidence</span>
                  </div>
                </SelectItem>
                <SelectItem value="particular">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-blue-400" />
                    <span>Particulier</span>
                  </div>
                </SelectItem>
                <SelectItem value="enterprise">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-orange-500" />
                    <span>Entreprise</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <div className="border rounded-md flex">
              <Button 
                variant={viewMode === 'grid' ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
            
            <TabsList>
              <TabsTrigger value="active" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Actifs ({activeProjects.length})</span>
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex items-center gap-1">
                <Archive className="h-4 w-4" />
                <span>Archivés ({archivedProjects.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="active" className="mt-0">
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              {activeProjects.length === 0 ? (
                <div className="max-w-md mx-auto">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-medium mb-2">Aucun chantier</h2>
                  <p className="text-muted-foreground mb-6">
                    Vous n'avez pas encore créé de fiche chantier. Commencez par créer votre premier chantier.
                  </p>
                  <Button onClick={() => setIsFormDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau chantier
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-medium mb-2">Aucun résultat</h2>
                  <p className="text-muted-foreground">
                    Aucun chantier ne correspond à votre recherche.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {filteredProjects.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={handleSelectProject}
                />
              ))}
            </div>
          )}
          
          {filteredProjects.length > 0 && viewMode === 'list' && (
            <ProjectListView
              projects={filteredProjects}
              onSelect={handleSelectProject}
            />
          )}
        </TabsContent>
        
        <TabsContent value="archived" className="mt-0">
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              {archivedProjects.length === 0 ? (
                <div>
                  <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-medium mb-2">Aucun chantier archivé</h2>
                  <p className="text-muted-foreground">
                    Les chantiers sont automatiquement archivés lorsqu'une date de fin est spécifiée.
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-medium mb-2">Aucun résultat</h2>
                  <p className="text-muted-foreground">
                    Aucun chantier archivé ne correspond à votre recherche.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {filteredProjects.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={handleSelectProject}
                />
              ))}
            </div>
          )}
          
          {filteredProjects.length > 0 && viewMode === 'list' && (
            <ProjectListView
              projects={filteredProjects}
              onSelect={handleSelectProject}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
