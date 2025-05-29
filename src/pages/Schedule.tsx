
import React, { useState } from 'react';
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
  
  const handleGenerateSchedule = () => {
    toast.success("Planning généré avec succès");
    // Dans une version future, nous implémenterons la logique complète de génération automatique du planning
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Agenda des passages</h1>
          <p className="text-muted-foreground">
            Planifiez et visualisez les passages prévus sur vos chantiers
          </p>
        </div>
        
        <Button onClick={handleGenerateSchedule}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Générer le planning
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <TabsList>
            <TabsTrigger value="planning" className="flex items-center gap-1">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Planning</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Règles</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Distribution</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <Select
              value={selectedTeam}
              onValueChange={setSelectedTeam}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Équipe" />
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mois" />
              </SelectTrigger>
              <SelectContent>
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
        
        <TabsContent value="planning" className="space-y-6">
          <div className="flex justify-end mb-2">
            <div className="border rounded-md flex">
              <Button 
                variant={viewMode === 'calendar' ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="px-3"
              >
                <CalendarDaysIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <Users className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
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
        </TabsContent>
        
        <TabsContent value="rules">
          <SchedulingRules projects={projectInfos} teams={teams} />
        </TabsContent>
        
        <TabsContent value="distribution">
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
