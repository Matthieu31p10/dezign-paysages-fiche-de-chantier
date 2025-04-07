
import React from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from '@/lib/utils';
import { FormControl } from '@/components/ui/form';
import { ProjectInfo } from '@/types/models';

interface ProjectLinkSectionProps {
  selectedProject: string | null;
  openProjectsCombobox: boolean;
  setOpenProjectsCombobox: (open: boolean) => void;
  activeProjects: ProjectInfo[];
  handleProjectSelect: (projectId: string) => void;
  handleClearProject: () => void;
}

const ProjectLinkSection: React.FC<ProjectLinkSectionProps> = ({
  selectedProject,
  openProjectsCombobox,
  setOpenProjectsCombobox,
  activeProjects,
  handleProjectSelect,
  handleClearProject
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <LinkIcon className="mr-2 h-5 w-5 text-muted-foreground" />
        Associer à un projet existant (optionnel)
      </h2>
      
      <Popover open={openProjectsCombobox} onOpenChange={setOpenProjectsCombobox}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openProjectsCombobox}
              className={cn(
                "w-full justify-between",
                !selectedProject && "text-muted-foreground"
              )}
            >
              {selectedProject ? 
                activeProjects.find(project => project.id === selectedProject)?.name :
                "Sélectionner un projet existant..."
              }
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Rechercher un projet..." />
            <CommandList>
              <CommandEmpty>Aucun projet trouvé.</CommandEmpty>
              <CommandGroup>
                {activeProjects.map(project => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={() => handleProjectSelect(project.id)}
                  >
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {selectedProject && (
            <div className="p-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-destructive"
                onClick={handleClearProject}
              >
                Effacer la sélection
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      {selectedProject && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Projet sélectionné: {activeProjects.find(p => p.id === selectedProject)?.name}</p>
          <p className="text-muted-foreground">Les informations du client ont été préremplies.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectLinkSection;
