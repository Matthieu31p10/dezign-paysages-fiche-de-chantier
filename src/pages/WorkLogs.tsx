
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import WorkLogList from '@/components/worklogs/WorkLogList';
import { getCurrentYear, getCurrentMonth } from '@/utils/helpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CalendarX, Filter, Calendar } from 'lucide-react';

const WorkLogs = () => {
  const navigate = useNavigate();
  const { workLogs, projectInfos, teams } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  
  // Filtrer les logs en fonction de tous les critères sélectionnés
  const filteredLogs = workLogs.filter(log => {
    // Filtre par projet
    const matchesProject = selectedProjectId === 'all' || log.projectId === selectedProjectId;
    
    // Filtre par équipe (via le projet)
    const matchesTeam = selectedTeamId === 'all' || 
      (projectInfos.find(p => p.id === log.projectId)?.team === selectedTeamId);
    
    // Filtre par année
    const logDate = new Date(log.date);
    const matchesYear = logDate.getFullYear() === selectedYear;
    
    // Filtre par mois (si sélectionné)
    const matchesMonth = selectedMonth === 'all' || logDate.getMonth() === (selectedMonth as number - 1);
    
    return matchesProject && matchesTeam && matchesYear && matchesMonth;
  });
  
  // Obtenir les années uniques pour le filtre
  const getAvailableYears = () => {
    const years = workLogs.map(log => new Date(log.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a); // Trier par ordre décroissant
  };
  
  const availableYears = getAvailableYears();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Suivi des travaux</h1>
          <p className="text-muted-foreground">
            Gérez vos fiches de suivi de chantier
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/worklogs/new')}
          disabled={projectInfos.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle fiche
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-64">
          <label className="text-sm font-medium block mb-2">Filtrer par chantier</label>
          <Select
            value={selectedProjectId}
            onValueChange={(value) => setSelectedProjectId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les chantiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les chantiers</SelectItem>
              {projectInfos.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-64">
          <label className="text-sm font-medium block mb-2">Filtrer par équipe</label>
          <Select
            value={selectedTeamId}
            onValueChange={(value) => setSelectedTeamId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les équipes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les équipes</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={getCurrentYear().toString()}>
                  {getCurrentYear()}
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
          <CardTitle>Fiches de suivi</CardTitle>
          <CardDescription>
            {selectedProjectId === 'all'
              ? 'Toutes les fiches de suivi'
              : `Fiches de suivi pour ${projectInfos.find(p => p.id === selectedProjectId)?.name || 'ce chantier'}`
            }
            {selectedMonth !== 'all' && ` - ${new Date(0, (selectedMonth as number) - 1).toLocaleString('fr-FR', { month: 'long' })}`}
            {` - ${selectedYear}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workLogs.length === 0 ? (
            <div className="text-center py-12">
              <CalendarX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Aucune fiche de suivi</h2>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore créé de fiche de suivi. Commencez par créer votre première fiche.
              </p>
              
              {projectInfos.length === 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Vous devez d'abord créer un chantier avant de pouvoir créer une fiche de suivi.
                  </p>
                  <Button onClick={() => navigate('/projects/new')}>
                    Créer un chantier
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/worklogs/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle fiche
                </Button>
              )}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Aucune fiche trouvée</h2>
              <p className="text-muted-foreground">
                Aucune fiche de suivi ne correspond aux critères sélectionnés.
              </p>
            </div>
          ) : (
            <WorkLogList workLogs={filteredLogs} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkLogs;
