
import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Users, CalendarDaysIcon, Clock } from 'lucide-react';
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
  
  const handleGenerateSchedule = () => {
    toast.success("Planning généré avec succès");
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda des passages</h1>
          <p className="text-gray-600 mt-2">
            Planifiez et visualisez les passages prévus sur vos chantiers
          </p>
        </div>
        
        <Button onClick={handleGenerateSchedule} className="hover:scale-105 transition-transform">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Générer le planning
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:flex">
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Planning</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Règles</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Distribution</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sélectionner une équipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les équipes</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Sélectionner un mois" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="planning" className="space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <Button 
                variant={viewMode === 'calendar' ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="h-8 px-3 transition-all"
              >
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                Calendrier
              </Button>
              <Button 
                variant={viewMode === 'list' ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3 transition-all"
              >
                <Users className="h-4 w-4 mr-1" />
                Liste
              </Button>
            </div>
          </div>
          
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
        
        <TabsContent value="rules" className="space-y-4">
          <SchedulingRules projects={projectInfos} teams={teams} />
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
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
