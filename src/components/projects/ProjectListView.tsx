
import { useState } from 'react';
import { ProjectInfo } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Home, Landmark, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectListViewProps {
  projects: ProjectInfo[];
  onSelect: (id: string) => void;
}

const ProjectListView = ({ projects, onSelect }: ProjectListViewProps) => {
  const navigate = useNavigate();
  
  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'residence':
        return <Building2 className="h-4 w-4 text-green-500" />;
      case 'particular':
        return <Home className="h-4 w-4 text-blue-400" />;
      case 'enterprise':
        return <Landmark className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden md:table-cell">Adresse</TableHead>
            <TableHead className="hidden md:table-cell">Passages</TableHead>
            <TableHead className="hidden md:table-cell">Heures</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.id}>
              <TableCell>
                {getProjectTypeIcon(project.projectType)}
              </TableCell>
              <TableCell className="font-medium">
                {project.name}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {project.address}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {project.annualVisits}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {project.annualTotalHours}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(project.id)}
                  >
                    Suivi
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectListView;
