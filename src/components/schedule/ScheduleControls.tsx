
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, CalendarDaysIcon, Users } from 'lucide-react';
import { Team } from '@/types/models';

interface ScheduleControlsProps {
  selectedMonth: number;
  selectedYear: number;
  selectedTeam: string;
  showWeekends: boolean;
  viewMode: 'calendar' | 'list';
  teams: Team[];
  months: Array<{ value: string; label: string }>;
  years: number[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onTeamChange: (team: string) => void;
  onShowWeekendsChange: (show: boolean) => void;
  onViewModeChange: (mode: 'calendar' | 'list') => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

const ScheduleControls: React.FC<ScheduleControlsProps> = ({
  selectedMonth,
  selectedYear,
  selectedTeam,
  showWeekends,
  viewMode,
  teams,
  months,
  years,
  onMonthChange,
  onYearChange,
  onTeamChange,
  onShowWeekendsChange,
  onViewModeChange,
  onNavigateMonth,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth('prev')}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-3">
          <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth('next')}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedTeam} onValueChange={onTeamChange}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Sélectionner une équipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-weekends"
            checked={showWeekends}
            onCheckedChange={onShowWeekendsChange}
          />
          <Label htmlFor="show-weekends" className="text-sm font-medium">
            Afficher les weekends
          </Label>
        </div>

        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          <Button 
            variant={viewMode === 'calendar' ? "default" : "ghost"} 
            size="sm"
            onClick={() => onViewModeChange('calendar')}
            className="h-8 px-3 transition-all"
          >
            <CalendarDaysIcon className="h-4 w-4 mr-1" />
            Calendrier
          </Button>
          <Button 
            variant={viewMode === 'list' ? "default" : "ghost"} 
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="h-8 px-3 transition-all"
          >
            <Users className="h-4 w-4 mr-1" />
            Liste
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleControls;
