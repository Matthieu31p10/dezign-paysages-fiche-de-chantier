
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectForm from '@/components/projects/ProjectForm';
import { Plus, FileText, Search } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const { projectInfos, selectProject } = useApp();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const filteredProjects = projectInfos.filter(project => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    return (
      project.name.toLowerCase().includes(searchLower) ||
      project.address.toLowerCase().includes(searchLower) ||
      project.additionalInfo.toLowerCase().includes(searchLower)
    );
  });
  
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
      
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un chantier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          {projectInfos.length === 0 ? (
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={handleSelectProject}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
