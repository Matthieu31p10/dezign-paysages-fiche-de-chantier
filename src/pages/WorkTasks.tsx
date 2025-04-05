
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarX, Plus } from 'lucide-react';
import { getCurrentYear, getCurrentMonth } from '@/utils/helpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WorkTaskList from '@/components/worktasks/WorkTaskList';

const WorkTasks = () => {
  const navigate = useNavigate();
  const { workTasks } = useApp();
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  
  // Filter logs based on selected criteria
  const filteredTasks = workTasks.filter(task => {
    // Filter by year
    const taskDate = new Date(task.date);
    const matchesYear = taskDate.getFullYear() === selectedYear;
    
    // Filter by month (if selected)
    const matchesMonth = selectedMonth === 'all' || taskDate.getMonth() === (typeof selectedMonth === 'number' ? selectedMonth - 1 : 0);
    
    return matchesYear && matchesMonth;
  });
  
  // Get unique years for the filter
  const getAvailableYears = () => {
    const years = workTasks.map(task => new Date(task.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a); // Sort in descending order
  };
  
  const availableYears = getAvailableYears();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Fiches de Travaux</h1>
          <p className="text-muted-foreground">
            Gérez vos fiches de travaux hors contrat
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/worktasks/new')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle fiche
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-64">
          <label className="text-sm font-medium block mb-2">Année</label>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <SelectItem key={year.toString()} value={year.toString()}>
                    {year.toString()}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={getCurrentYear().toString()}>
                  {getCurrentYear().toString()}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-64">
          <label className="text-sm font-medium block mb-2">Mois</label>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(value === 'all' ? 'all' : Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les mois" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les mois</SelectItem>
              <SelectItem value="1">Janvier</SelectItem>
              <SelectItem value="2">Février</SelectItem>
              <SelectItem value="3">Mars</SelectItem>
              <SelectItem value="4">Avril</SelectItem>
              <SelectItem value="5">Mai</SelectItem>
              <SelectItem value="6">Juin</SelectItem>
              <SelectItem value="7">Juillet</SelectItem>
              <SelectItem value="8">Août</SelectItem>
              <SelectItem value="9">Septembre</SelectItem>
              <SelectItem value="10">Octobre</SelectItem>
              <SelectItem value="11">Novembre</SelectItem>
              <SelectItem value="12">Décembre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Fiches de Travaux</CardTitle>
          <CardDescription>
            {`Fiches de travaux ponctuels hors contrat`}
            {selectedMonth !== 'all' && ` - ${new Date(0, Number(selectedMonth) - 1).toLocaleString('fr-FR', { month: 'long' })}`}
            {` - ${selectedYear}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workTasks.length === 0 ? (
            <div className="text-center py-12">
              <CalendarX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Aucune fiche de travaux</h2>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore créé de fiche de travaux. Commencez par créer votre première fiche.
              </p>
              
              <Button onClick={() => navigate('/worktasks/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle fiche
              </Button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Aucune fiche trouvée</h2>
              <p className="text-muted-foreground">
                Aucune fiche de travaux ne correspond aux critères sélectionnés.
              </p>
            </div>
          ) : (
            <WorkTaskList workTasks={filteredTasks} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkTasks;
