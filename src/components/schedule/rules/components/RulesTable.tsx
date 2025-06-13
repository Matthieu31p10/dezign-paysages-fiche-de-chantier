
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ProjectInfo } from '@/types/models';
import { ProjectRule } from '../types';
import { weekDays } from '../constants';

interface RulesTableProps {
  projectRules: ProjectRule[];
  projects: ProjectInfo[];
  onRemoveRule: (projectId: string) => void;
}

const RulesTable: React.FC<RulesTableProps> = ({ projectRules, projects, onRemoveRule }) => {
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Chantier inconnu";
  };
  
  const getFixedDaysCount = (days: Record<string, boolean>) => {
    return Object.values(days).filter(Boolean).length;
  };

  if (projectRules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune règle définie. Utilisez le formulaire pour ajouter des règles de planification.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Chantier</TableHead>
          <TableHead>Jours fixes</TableHead>
          <TableHead>Distribution</TableHead>
          <TableHead>Max. jours consécutifs</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projectRules.map((rule) => (
          <TableRow key={rule.projectId}>
            <TableCell className="font-medium">
              {getProjectName(rule.projectId)}
            </TableCell>
            <TableCell>
              {getFixedDaysCount(rule.fixedDays) === 0 ? (
                <span className="text-gray-500">Aucun jour fixe</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {weekDays
                    .filter(day => rule.fixedDays[day.id])
                    .map(day => (
                      <span key={day.id} className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5">
                        {day.label.substring(0, 3)}
                      </span>
                    ))
                  }
                </div>
              )}
            </TableCell>
            <TableCell>
              {rule.distributionStrategy === 'even' && "Uniforme"}
              {rule.distributionStrategy === 'start' && "Début de mois"}
              {rule.distributionStrategy === 'end' && "Fin de mois"}
            </TableCell>
            <TableCell>{rule.maxConsecutiveDays}</TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRemoveRule(rule.projectId)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Supprimer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RulesTable;
