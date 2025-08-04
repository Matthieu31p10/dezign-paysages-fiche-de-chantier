import React, { useState } from 'react';
import { ProjectInfo } from '@/types/models';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Archive, 
  Trash2, 
  Download, 
  Edit3, 
  MoreHorizontal,
  CheckSquare,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BulkActionsBarProps {
  selectedProjects: string[];
  projects: ProjectInfo[];
  onClearSelection: () => void;
  onBulkArchive: (projectIds: string[]) => void;
  onBulkDelete: (projectIds: string[]) => void;
  onBulkExport: (projectIds: string[]) => void;
  onSelectAll: () => void;
  isVisible: boolean;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedProjects,
  projects,
  onClearSelection,
  onBulkArchive,
  onBulkDelete,
  onBulkExport,
  onSelectAll,
  isVisible
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const selectedCount = selectedProjects.length;
  const allSelected = selectedCount === projects.length;
  const someSelected = selectedCount > 0 && selectedCount < projects.length;

  if (!isVisible) return null;

  return (
    <Card className={cn(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 border-2 shadow-2xl transition-all duration-300",
      "bg-gradient-to-r from-blue-50 via-white to-blue-50 border-blue-200",
      isVisible ? "animate-slide-in-up opacity-100" : "animate-slide-out-down opacity-0"
    )}>
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Sélection */}
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectAll();
              } else {
                onClearSelection();
              }
            }}
            className="border-2 data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary"
            {...(someSelected && !allSelected ? { 'data-state': 'indeterminate' } : {})}
          />
          <div className="text-sm font-medium">
            <span className="text-blue-700">{selectedCount}</span>
            <span className="text-gray-600 ml-1">
              projet{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Actions principales */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkArchive(selectedProjects)}
            className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all"
            disabled={selectedCount === 0}
          >
            <Archive className="h-4 w-4 mr-1" />
            Archiver
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkExport(selectedProjects)}
            className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all"
            disabled={selectedCount === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </Button>

          {/* Actions supplémentaires */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-gray-50 transition-all"
                disabled={selectedCount === 0}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onBulkDelete(selectedProjects)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer définitivement
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit3 className="h-4 w-4 mr-2" />
                Modification en lot
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckSquare className="h-4 w-4 mr-2" />
                Marquer comme terminé
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bouton fermer */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="hover:bg-red-50 hover:text-red-600 transition-all ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Badge du nombre total */}
      {selectedCount > 0 && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-blue-600 text-white animate-pulse">
            {selectedCount}
          </Badge>
        </div>
      )}
    </Card>
  );
};

export default BulkActionsBar;