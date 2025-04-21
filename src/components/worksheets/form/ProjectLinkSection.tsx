
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon, Search, X, FileSearch } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from '@/lib/utils';
import { FormControl } from '@/components/ui/form';
import { ProjectInfo } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/context/ProjectsContext';

interface ProjectLinkSectionProps {
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onClearProject: () => void;
  projectInfos?: ProjectInfo[];
}

const ProjectLinkSection: React.FC<ProjectLinkSectionProps> = ({
  selectedProjectId,
  onProjectSelect,
  onClearProject,
  projectInfos = []
}) => {
  const [openProjectsCombobox, setOpenProjectsCombobox] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { projectInfos: contextProjects } = useProjects();
  
  // Utiliser les projets du contexte pour inclure tous les projets
  const allProjects = contextProjects.length > 0 ? contextProjects : projectInfos;
  
  // Filter projects based on search term
  const filteredProjects = useCallback(() => {
    if (!searchTerm) return allProjects;
    
    return allProjects.filter(project => 
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allProjects, searchTerm]);
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  useEffect(() => {
    console.log("Projets disponibles:", allProjects.length);
  }, [allProjects]);
  
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-blue-50">
      <h2 className="text-lg font-medium flex items-center text-blue-700">
        <LinkIcon className="mr-2 h-5 w-5" />
        Associer à un projet existant (optionnel)
      </h2>
      
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <Popover open={openProjectsCombobox} onOpenChange={setOpenProjectsCombobox}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProjectsCombobox}
                  className={cn(
                    "w-full justify-between bg-white",
                    !selectedProjectId && "text-muted-foreground"
                  )}
                >
                  {selectedProjectId ? (
                    <span className="flex items-center">
                      <FileSearch className="mr-2 h-4 w-4 text-blue-600" />
                      {allProjects.find(project => project.id === selectedProjectId)?.name}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="mr-2 h-4 w-4" />
                      Rechercher un projet existant...
                    </span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput 
                  placeholder="Rechercher un projet par nom, client ou adresse..." 
                  value={searchTerm} 
                  onValueChange={handleSearchChange}
                />
                <CommandList>
                  <CommandEmpty>Aucun projet trouvé.</CommandEmpty>
                  <CommandGroup heading="Projets actifs">
                    {filteredProjects().map(project => (
                      <CommandItem
                        key={project.id}
                        value={project.id}
                        onSelect={() => {
                          onProjectSelect(project.id);
                          setOpenProjectsCombobox(false);
                          setSearchTerm('');
                        }}
                        className="flex flex-col items-start py-3"
                      >
                        <div className="font-medium">{project.name}</div>
                        {project.clientName && (
                          <div className="text-sm text-muted-foreground">
                            Client: {project.clientName}
                          </div>
                        )}
                        {project.address && (
                          <div className="text-xs text-muted-foreground">
                            Adresse: {project.address}
                          </div>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {selectedProjectId && (
        <div className="rounded-md bg-blue-100 p-3 text-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">Projet sélectionné: {allProjects.find(p => p.id === selectedProjectId)?.name}</p>
              <p className="text-muted-foreground text-xs mt-1">Les informations du client ont été préremplies.</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
              onClick={onClearProject}
            >
              <X className="h-4 w-4 mr-1" />
              Annuler la liaison
            </Button>
          </div>
          
          <Badge variant="outline" className="mt-2 bg-white">
            Projet associé
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ProjectLinkSection;
