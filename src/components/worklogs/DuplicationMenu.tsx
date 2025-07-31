import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Calendar, CalendarDays, Files } from 'lucide-react';
import { WorkLog } from '@/types/models';
import { useDuplication } from '@/hooks/useDuplication';

interface DuplicationMenuProps {
  workLog: WorkLog;
  onDuplicate: (duplicatedWorkLog: Partial<WorkLog>) => void;
  onBulkDuplicate?: (duplicatedWorkLogs: Partial<WorkLog>[]) => void;
}

export const DuplicationMenu: React.FC<DuplicationMenuProps> = ({
  workLog,
  onDuplicate,
  onBulkDuplicate
}) => {
  const { duplicateWorkLog, createWeeklyDuplication } = useDuplication();

  const handleSimpleDuplication = () => {
    const duplicated = duplicateWorkLog(workLog);
    onDuplicate(duplicated);
  };

  const handleWeeklyDuplication = () => {
    const duplicated = createWeeklyDuplication(workLog, 7);
    if (onBulkDuplicate) {
      onBulkDuplicate(duplicated);
    }
  };

  const handleMonthlyDuplication = () => {
    const duplicated = createWeeklyDuplication(workLog, 30);
    if (onBulkDuplicate) {
      onBulkDuplicate(duplicated);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Dupliquer
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSimpleDuplication}>
          <Files className="h-4 w-4 mr-2" />
          Dupliquer cette fiche
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleWeeklyDuplication}>
          <Calendar className="h-4 w-4 mr-2" />
          Dupliquer pour 7 jours
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMonthlyDuplication}>
          <CalendarDays className="h-4 w-4 mr-2" />
          Dupliquer pour 30 jours
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};