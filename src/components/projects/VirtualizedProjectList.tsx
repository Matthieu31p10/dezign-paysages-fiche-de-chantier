import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ProjectInfo } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Home, Landmark, Eye, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VirtualizedProjectListProps {
  projects: ProjectInfo[];
  onSelect: (id: string) => void;
  containerHeight?: number;
}

interface ListItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    projects: ProjectInfo[];
    onSelect: (id: string) => void;
    navigate: (path: string) => void;
  };
}

const ListItem: React.FC<ListItemProps> = ({ index, style, data }) => {
  const { projects, onSelect, navigate } = data;
  const project = projects[index];

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
    <div 
      style={style}
      className="flex items-center px-4 py-2 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-white transition-all duration-200 group border-b border-gray-100"
    >
      {/* Type */}
      <div className="flex items-center gap-2 w-32">
        {getProjectTypeIcon(project.projectType)}
        <div className="hidden sm:block">
          {getProjectTypeBadge(project.projectType)}
        </div>
      </div>

      {/* Nom du projet */}
      <div className="flex-1 min-w-0 px-4">
        <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors truncate">
          {project.name}
        </div>
        {project.isArchived && (
          <Badge variant="outline" className="mt-1 bg-gray-100 text-gray-600 text-xs">
            Archivé
          </Badge>
        )}
      </div>

      {/* Adresse */}
      <div className="hidden md:block flex-1 min-w-0 px-4 text-gray-600">
        <div className="truncate">{project.address}</div>
      </div>

      {/* Passages/an */}
      <div className="hidden md:block w-24 text-center px-2">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {project.annualVisits}
        </Badge>
      </div>

      {/* Heures/an */}
      <div className="hidden md:block w-24 text-center px-2">
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          {project.annualTotalHours}h
        </Badge>
      </div>

      {/* Actions */}
      <div className="w-32 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/projects/${project.id}`)}
          className="hover:bg-gray-100 transition-colors duration-200"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect(project.id)}
          className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const VirtualizedProjectList: React.FC<VirtualizedProjectListProps> = ({
  projects,
  onSelect,
  containerHeight = 600
}) => {
  const navigate = useNavigate();

  const itemData = useMemo(() => ({
    projects,
    onSelect,
    navigate
  }), [projects, onSelect, navigate]);

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
      {/* Header fixe */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-25 border-b p-4">
        <div className="flex items-center">
          <div className="w-32 font-semibold">Type</div>
          <div className="flex-1 px-4 font-semibold">Nom du projet</div>
          <div className="hidden md:block flex-1 px-4 font-semibold">Adresse</div>
          <div className="hidden md:block w-24 text-center font-semibold">Passages/an</div>
          <div className="hidden md:block w-24 text-center font-semibold">Heures/an</div>
          <div className="w-32 text-right font-semibold">Actions</div>
        </div>
      </div>

      {/* Liste virtualisée */}
      <List
        height={Math.min(containerHeight, projects.length * 80)}
        width="100%"
        itemCount={projects.length}
        itemSize={80}
        itemData={itemData}
        overscanCount={5}
      >
        {ListItem}
      </List>
    </div>
  );
};

export default VirtualizedProjectList;