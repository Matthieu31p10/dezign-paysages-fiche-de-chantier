import { useState } from 'react';
import { WorkLog } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/helpers';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Calendar, Clock, Edit, Trash, User, ArrowDownAZ, ArrowUpAZ, CalendarDays, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { groupWorkLogsByMonth, formatMonthYear, getCurrentYear, getYearsFromWorkLogs, filterWorkLogsByYear } from '@/utils/helpers';

interface WorkLogListProps {
  workLogs: WorkLog[];
  projectId?: string;
}

const WorkLogList = ({ workLogs, projectId }: WorkLogListProps) => {
  const navigate = useNavigate();
  const { deleteWorkLog, getProjectById, settings } = useApp();
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [sortOption, setSortOption] = useState<string>('date-desc');
  
  const yearFilteredLogs = selectedYear 
    ? filterWorkLogsByYear(workLogs, selectedYear) 
    : workLogs;
  
  const availableYears = getYearsFromWorkLogs(workLogs);
  
  const filteredLogs = yearFilteredLogs.filter(log => {
    if (!search.trim()) return true;
    
    const project = getProjectById(log.projectId);
    const searchLower = search.toLowerCase();
    
    return (
      project?.name.toLowerCase().includes(searchLower) ||
      formatDate(log.date).includes(searchLower) ||
      log.personnel.some(p => p.toLowerCase().includes(searchLower))
    );
  });
  
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    switch(sortOption) {
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'project-asc':
        const projectA = getProjectById(a.projectId)?.name || '';
        const projectB = getProjectById(b.projectId)?.name || '';
        return projectA.localeCompare(projectB);
      case 'project-desc':
        const projectNameA = getProjectById(a.projectId)?.name || '';
        const projectNameB = getProjectById(b.projectId)?.name || '';
        return projectNameB.localeCompare(projectNameA);
      case 'hours-asc':
        return a.timeTracking.totalHours - b.timeTracking.totalHours;
      case 'hours-desc':
        return b.timeTracking.totalHours - a.timeTracking.totalHours;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
  
  const groupedLogs = groupWorkLogsByMonth(sortedLogs);
  
  const sortedMonths = Object.keys(groupedLogs).sort((a, b) => {
    const [monthA, yearA] = a.split('-').map(Number);
    const [monthB, yearB] = b.split('-').map(Number);
    
    if (sortOption.includes('asc')) {
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    } else {
      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    }
  });
  
  const handleDeleteWorkLog = (id: string) => {
    deleteWorkLog(id);
  };
  
  const generateWorkLogCode = (index: number) => {
    return `DZFS${String(index + 1).padStart(5, '0')}`;
  };
  
  if (workLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Aucune fiche de suivi disponible</p>
        <Button onClick={() => navigate(projectId ? `/worklogs/new?projectId=${projectId}` : '/worklogs/new')}>
          Créer une fiche de suivi
        </Button>
      </div>
    );
  }
  
  if (filteredLogs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
          <div className="w-full md:w-64">
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun résultat trouvé</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div className="w-full md:w-64">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (récent → ancien)</SelectItem>
              <SelectItem value="date-asc">Date (ancien → récent)</SelectItem>
              <SelectItem value="project-asc">Chantier (A → Z)</SelectItem>
              <SelectItem value="project-desc">Chantier (Z → A)</SelectItem>
              <SelectItem value="hours-desc">Heures (plus → moins)</SelectItem>
              <SelectItem value="hours-asc">Heures (moins → plus)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedMonths.map(month => (
          <div key={month} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {formatMonthYear(month)}
            </h3>
            
            <div className="space-y-2">
              {groupedLogs[month].map((log, index) => {
                const project = getProjectById(log.projectId);
                const worklogCode = generateWorkLogCode(index);
                
                return (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 bg-white hover:shadow transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-brand-50 text-brand-700 font-mono">
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            {worklogCode}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-brand-50 text-brand-700">
                            {formatDate(log.date)}
                          </Badge>
                          {!projectId && project && (
                            <Badge variant="secondary">
                              {project.name}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                          <div className="flex items-center text-sm">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                            {log.timeTracking.totalHours.toFixed(2)} heures
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <User className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                            {log.personnel.length} personnes
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/worklogs/${log.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. Elle supprimera définitivement la fiche de suivi.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteWorkLog(log.id)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {log.tasksPerformed.watering !== 'none' && (
                        <Badge variant="outline" className="bg-slate-50">
                          Arrosage {log.tasksPerformed.watering === 'on' ? 'allumé' : 'coupé'}
                        </Badge>
                      )}
                      
                      {log.tasksPerformed.customTasks && Object.entries(log.tasksPerformed.customTasks).map(([taskId, isDone]) => {
                        if (!isDone) return null;
                        
                        const customTask = settings.customTasks?.find(task => task.id === taskId);
                        if (!customTask) return null;
                        
                        const progress = log.tasksPerformed.customTasksProgress?.[taskId];
                        const progressText = progress !== undefined ? ` ${progress}%` : '';
                        
                        return (
                          <Badge key={taskId} variant="outline" className="bg-slate-50">
                            {customTask.name}{progressText}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkLogList;
