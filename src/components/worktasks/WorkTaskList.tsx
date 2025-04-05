
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { WorkTask } from '@/types/workTask';
import { formatDate } from '@/utils/helpers';
import { Eye, FileText } from 'lucide-react';

interface WorkTaskListProps {
  workTasks: WorkTask[];
}

const WorkTaskList: React.FC<WorkTaskListProps> = ({ workTasks }) => {
  const navigate = useNavigate();

  const sortedTasks = [...workTasks].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Date</TableHead>
          <TableHead>Chantier</TableHead>
          <TableHead>Adresse</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="text-center">Heures totales</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{formatDate(task.date)}</TableCell>
            <TableCell>{task.projectName}</TableCell>
            <TableCell className="max-w-[200px] truncate">{task.address}</TableCell>
            <TableCell>{task.contactName}</TableCell>
            <TableCell className="text-center">{task.timeTracking.totalHours.toFixed(1)}h</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/worktasks/${task.id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/worktasks/${task.id}/print`);
                  }}
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default WorkTaskList;
