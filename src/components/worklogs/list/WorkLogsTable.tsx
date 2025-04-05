
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { WorkLog } from '@/types/models';
import { formatDate } from '@/utils/helpers';

interface WorkLogsTableProps {
  currentWorkLogs: WorkLog[];
  sortColumn: string;
  sortDirection: string;
  handleSort: (column: string) => void;
}

const WorkLogsTable = ({ 
  currentWorkLogs, 
  sortColumn, 
  sortDirection, 
  handleSort 
}: WorkLogsTableProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" onClick={() => handleSort('date')}>
                Date
                {sortColumn === 'date' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('projectId')}>
                Chantier
                {sortColumn === 'projectId' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('duration')}>
                Durée
                {sortColumn === 'duration' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('personnel')}>
                Personnel
                {sortColumn === 'personnel' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentWorkLogs.map(workLog => (
            <TableRow key={workLog.id}>
              <TableCell className="font-medium">{formatDate(workLog.date)}</TableCell>
              <TableCell>{workLog.projectId}</TableCell>
              <TableCell>{workLog.duration} heures</TableCell>
              <TableCell>
                {workLog.personnel.map((person, index) => (
                  <div key={index}>{person}</div>
                ))}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/worklogs/${workLog.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {currentWorkLogs.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Aucune fiche de suivi trouvée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkLogsTable;
