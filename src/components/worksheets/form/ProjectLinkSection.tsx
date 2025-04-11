
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from '@/lib/utils';
import { FormControl } from '@/components/ui/form';
import { ProjectInfo } from '@/types/models';

interface ProjectLinkSectionProps {
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onClearProject: () => void;
  projectInfos: ProjectInfo[];
}

const ProjectLinkSection: React.FC<ProjectLinkSectionProps> = ({
  selectedProjectId,
  onProjectSelect,
  onClearProject,
  projectInfos
}) => {
  const [openProjectsCombobox, setOpenProjectsCombobox] = useState(false);
  
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
                !selectedProjectId && "text-muted-foreground"
              )}
            >
              {selectedProjectId ? 
                projectInfos.find(project => project.id === selectedProjectId)?.name :
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
                {projectInfos.map(project => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={() => onProjectSelect(project.id)}
                  >
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {selectedProjectId && (
            <div className="p-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-destructive"
                onClick={onClearProject}
              >
                Effacer la sélection
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      {selectedProjectId && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Projet sélectionné: {projectInfos.find(p => p.id === selectedProjectId)?.name}</p>
          <p className="text-muted-foreground">Les informations du client ont été préremplies.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectLinkSection;
