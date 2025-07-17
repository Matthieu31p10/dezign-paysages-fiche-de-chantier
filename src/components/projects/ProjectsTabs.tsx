import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Archive } from 'lucide-react';

interface ProjectsTabsProps {
  activeProjectsCount: number;
  archivedProjectsCount: number;
}

const ProjectsTabs = ({ activeProjectsCount, archivedProjectsCount }: ProjectsTabsProps) => {
  return (
    <TabsList>
      <TabsTrigger value="active" className="flex items-center gap-1">
        <FileText className="h-4 w-4" />
        <span>Actifs ({activeProjectsCount})</span>
      </TabsTrigger>
      <TabsTrigger value="archived" className="flex items-center gap-1">
        <Archive className="h-4 w-4" />
        <span>Archivés ({archivedProjectsCount})</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default ProjectsTabs;