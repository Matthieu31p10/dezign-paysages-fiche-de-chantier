
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { MonthlyRule } from '../types';
import { months } from '../constants';

interface DistributionTableProps {
  filteredRules: MonthlyRule[];
  isEditing: boolean;
  getProjectName: (projectId: string) => string;
  getProjectTeam: (projectId: string) => string;
  calculateAnnualTotal: (rule: MonthlyRule) => number;
  handleMonthValueChange: (projectId: string, monthIndex: string, value: number) => void;
  monthlyTotals: Record<string, number>;
  selectedTeam: string;
  teams: any[];
}

const DistributionTable: React.FC<DistributionTableProps> = ({
  filteredRules,
  isEditing,
  getProjectName,
  getProjectTeam,
  calculateAnnualTotal,
  handleMonthValueChange,
  monthlyTotals,
  selectedTeam,
  teams
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Chantier</TableHead>
            <TableHead className="sticky left-[200px] bg-background z-10 min-w-[150px]">Équipe</TableHead>
            {months.map((month, index) => (
              <TableHead key={month} className="text-center min-w-[80px]">
                <div className="flex flex-col items-center">
                  <span className="font-medium">{month.substring(0, 3)}</span>
                  <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                </div>
              </TableHead>
            ))}
            <TableHead className="text-center min-w-[80px]">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRules.map((rule) => (
            <TableRow key={rule.projectId}>
              <TableCell className="font-medium sticky left-0 bg-background z-10 whitespace-nowrap">
                {getProjectName(rule.projectId)}
              </TableCell>
              <TableCell className="sticky left-[200px] bg-background z-10 whitespace-nowrap">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  {getProjectTeam(rule.projectId)}
                </span>
              </TableCell>
              {months.map((_, index) => (
                <TableCell key={index} className="p-1 text-center">
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      className="h-8 w-16 text-center"
                      value={rule.monthlyVisits[index.toString()] || 0}
                      onChange={(e) => handleMonthValueChange(
                        rule.projectId, 
                        index.toString(), 
                        Number(e.target.value)
                      )}
                    />
                  ) : (
                    <span className="font-medium">
                      {rule.monthlyVisits[index.toString()] || 0}
                    </span>
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-bold bg-muted">
                {calculateAnnualTotal(rule)}
              </TableCell>
            </TableRow>
          ))}
          
          {/* Ligne de totaux si plusieurs projets */}
          {filteredRules.length > 1 && (
            <TableRow className="bg-primary/5 border-t-2 border-primary/20">
              <TableCell className="font-bold sticky left-0 bg-primary/5 z-10">
                TOTAL {selectedTeam === 'all' ? 'GÉNÉRAL' : teams.find(t => t.id === selectedTeam)?.name.toUpperCase()}
              </TableCell>
              <TableCell className="sticky left-[200px] bg-primary/5 z-10">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
                  {filteredRules.length} chantier{filteredRules.length > 1 ? 's' : ''}
                </span>
              </TableCell>
              {months.map((_, index) => (
                <TableCell key={index} className="text-center font-bold text-primary">
                  {monthlyTotals[index.toString()]}
                </TableCell>
              ))}
              <TableCell className="text-center font-bold text-primary bg-primary/10">
                {Object.values(monthlyTotals).reduce((sum, val) => sum + val, 0)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DistributionTable;
