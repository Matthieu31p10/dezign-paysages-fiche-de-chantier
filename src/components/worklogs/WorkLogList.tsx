
import { useState } from 'react';
import { WorkLog } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/helpers';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Calendar, Clock, Edit, Trash, User } from 'lucide-react';
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
  const { deleteWorkLog, getProjectById } = useApp();
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  
  // Filter work logs for the selected year
  const yearFilteredLogs = selectedYear 
    ? filterWorkLogsByYear(workLogs, selectedYear) 
    : workLogs;
  
  // Get available years from the work logs
  const availableYears = getYearsFromWorkLogs(workLogs);
  
  // Filter logs by search term
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
  
  // Group logs by month
  const groupedLogs = groupWorkLogsByMonth(filteredLogs);
  
  // Sort months in reverse chronological order
  const sortedMonths = Object.keys(groupedLogs).sort((a, b) => {
    const [monthA, yearA] = a.split('-').map(Number);
    const [monthB, yearB] = b.split('-').map(Number);
    
    if (yearA !== yearB) return yearB - yearA;
    return monthB - monthA;
  });
  
  const handleDeleteWorkLog = (id: string) => {
    deleteWorkLog(id);
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
      
      <div className="space-y-6">
        {sortedMonths.map(month => (
          <div key={month} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {formatMonthYear(month)}
            </h3>
            
            <div className="space-y-2">
              {groupedLogs[month].map(log => {
                const project = getProjectById(log.projectId);
                
                return (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 bg-white hover:shadow transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
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
                      {log.tasksPerformed.mowing && (
                        <Badge variant="outline" className="bg-slate-50">
                          Tonte
                        </Badge>
                      )}
                      {log.tasksPerformed.brushcutting && (
                        <Badge variant="outline" className="bg-slate-50">
                          Débroussaillage
                        </Badge>
                      )}
                      {log.tasksPerformed.blower && (
                        <Badge variant="outline" className="bg-slate-50">
                          Souffleur
                        </Badge>
                      )}
                      {log.tasksPerformed.manualWeeding && (
                        <Badge variant="outline" className="bg-slate-50">
                          Désherbage manuel
                        </Badge>
                      )}
                      {log.tasksPerformed.whiteVinegar && (
                        <Badge variant="outline" className="bg-slate-50">
                          Vinaigre blanc
                        </Badge>
                      )}
                      {log.tasksPerformed.pruning.done && (
                        <Badge variant="outline" className="bg-slate-50">
                          Taille {log.tasksPerformed.pruning.progress}%
                        </Badge>
                      )}
                      {log.tasksPerformed.watering !== 'none' && (
                        <Badge variant="outline" className="bg-slate-50">
                          Arrosage {log.tasksPerformed.watering === 'on' ? 'allumé' : 'coupé'}
                        </Badge>
                      )}
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
