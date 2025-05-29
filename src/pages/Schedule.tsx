
import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Users, CalendarDaysIcon, Clock, Sparkles, TrendingUp } from 'lucide-react';
import ScheduleCalendar from '@/components/schedule/ScheduleCalendar';
import TeamSchedules from '@/components/schedule/TeamSchedules';
import SchedulingRules from '@/components/schedule/SchedulingRules';
import MonthlyDistribution from '@/components/schedule/MonthlyDistribution';
import { getCurrentMonth, getCurrentYear } from '@/utils/date-helpers';
import { toast } from 'sonner';

const Schedule = () => {
  const { projectInfos, teams } = useApp();
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [activeTab, setActiveTab] = useState<string>('planning');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mémorisation des données filtrées
  const filteredProjects = useMemo(() => {
    return selectedTeam === 'all' 
      ? projectInfos 
      : projectInfos.filter(project => project.team === selectedTeam);
  }, [projectInfos, selectedTeam]);
  
  const handleGenerateSchedule = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Simulation d'une génération de planning
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Planning généré avec succès", {
        description: `${filteredProjects.length} chantier(s) planifié(s)`,
        duration: 4000,
      });
    } catch (error) {
      toast.error("Erreur lors de la génération du planning");
    } finally {
      setIsGenerating(false);
    }
  }, [filteredProjects.length]);
  
  const handleTeamChange = useCallback((value: string) => {
    setSelectedTeam(value);
  }, []);
  
  const handleMonthChange = useCallback((value: string) => {
    setSelectedMonth(parseInt(value));
  }, []);
  
  const monthName = useMemo(() => {
    return new Date(selectedYear, selectedMonth - 1).toLocaleString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  }, [selectedMonth, selectedYear]);
  
  const tabsData = useMemo(() => [
    { 
      id: 'planning', 
      label: 'Planning', 
      icon: CalendarDaysIcon,
      description: 'Vue calendrier et liste des passages'
    },
    { 
      id: 'rules', 
      label: 'Règles', 
      icon: Clock,
      description: 'Configuration des règles de planification'
    },
    { 
      id: 'distribution', 
      label: 'Distribution', 
      icon: TrendingUp,
      description: 'Répartition mensuelle des interventions'
    }
  ], []);
  
  const months = useMemo(() => [
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" }
  ], []);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête amélioré */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda des passages</h1>
              <p className="text-gray-600 mt-1">
                Planifiez et visualisez les passages prévus sur vos chantiers
              </p>
            </div>
          </div>
          
          {/* Statistiques rapides */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{filteredProjects.length} chantier(s) actif(s)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>{teams.length} équipe(s)</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateSchedule}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200 hover:shadow-md"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Génération...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Générer le planning
            </>
          )}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            {tabsData.map(tab => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Filtres améliorés */}
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <Select value={selectedTeam} onValueChange={handleTeamChange}>
              <SelectTrigger className="w-full sm:w-[200px] border-green-200 focus:border-green-500">
                <SelectValue placeholder="Sélectionner une équipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>Toutes les équipes</span>
                  </div>
                </SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{team.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-full sm:w-[200px] border-green-200 focus:border-green-500">
                <SelectValue placeholder="Sélectionner un mois" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-green-600" />
                      <span>{month.label} {selectedYear}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="planning" className="space-y-6">
          {/* Indicateur du mois actuel */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Planning pour {monthName}</span>
              </CardTitle>
              <CardDescription className="text-green-700">
                {selectedTeam === 'all' 
                  ? `Vue d'ensemble de toutes les équipes` 
                  : `Équipe ${teams.find(t => t.id === selectedTeam)?.name || 'inconnue'}`
                }
              </CardDescription>
            </CardHeader>
          </Card>
          
          {/* Sélecteur de vue amélioré */}
          <div className="flex justify-end mb-4">
            <div className="border border-green-200 rounded-lg flex bg-white shadow-sm">
              <Button 
                variant={viewMode === 'calendar' ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-l-lg transition-all duration-200 ${
                  viewMode === 'calendar' 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Calendrier</span>
              </Button>
              <Button 
                variant={viewMode === 'list' ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-r-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Liste</span>
              </Button>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="transition-all duration-300">
            {viewMode === 'calendar' ? (
              <ScheduleCalendar 
                month={selectedMonth} 
                year={selectedYear} 
                teamId={selectedTeam}
              />
            ) : (
              <TeamSchedules
                month={selectedMonth}
                year={selectedYear}
                teamId={selectedTeam}
                teams={teams}
                projects={projectInfos}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="rules" className="animate-fade-in">
          <SchedulingRules projects={projectInfos} teams={teams} />
        </TabsContent>
        
        <TabsContent value="distribution" className="animate-fade-in">
          <MonthlyDistribution 
            projects={projectInfos} 
            teams={teams}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;
