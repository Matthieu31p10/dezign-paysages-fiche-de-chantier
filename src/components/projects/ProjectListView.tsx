
import { useState } from 'react';
import { ProjectInfo } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Home, Landmark, ArrowUpRight, User, Eye } from 'lucide-react';
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

  const getProjectTypeBadge = (type: string) => {
    switch (type) {
      case 'residence':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Résidence</Badge>;
      case 'particular':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Particulier</Badge>;
      case 'enterprise':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Entreprise</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-25 border-b">
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Nom du projet</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">Adresse</TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-center">Passages/an</TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-center">Heures/an</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow 
              key={project.id} 
              className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-white transition-all duration-200 group"
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  {getProjectTypeIcon(project.projectType)}
                  <div className="hidden sm:block">
                    {getProjectTypeBadge(project.projectType)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium py-4">
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {project.name}
                  </div>
                  {project.isArchived && (
                    <Badge variant="outline" className="mt-1 bg-gray-100 text-gray-600 text-xs">
                      Archivé
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell py-4 text-gray-600 max-w-xs">
                <div className="truncate">{project.address}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell py-4 text-center">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {project.annualVisits}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell py-4 text-center">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {project.annualTotalHours}h
                </Badge>
              </TableCell>
              <TableCell className="text-right py-4">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Voir</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(project.id)}
                    className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Suivi</span>
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
