
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, List, Settings } from 'lucide-react';
import { Team } from '@/types/models';

interface ModernScheduleHeaderProps {
  selectedMonth: number;
  selectedYear: number;
  selectedTeams: string[];
  viewMode: 'calendar' | 'list';
  showWeekends: boolean;
  teams: Team[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onTeamsChange: (teams: string[]) => void;
  onViewModeChange: (mode: 'calendar' | 'list') => void;
  onShowWeekendsChange: (show: boolean) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

const ModernScheduleHeader: React.FC<ModernScheduleHeaderProps> = ({
  selectedMonth,
  selectedYear,
  selectedTeams,
  viewMode,
  showWeekends,
  teams,
  onMonthChange,
  onYearChange,
  onTeamsChange,
  onViewModeChange,
  onShowWeekendsChange,
  onNavigateMonth,
}) => {
  const months = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

  const handleTeamToggle = (teamId: string) => {
    if (teamId === 'all') {
      onTeamsChange(['all']);
    } else {
      const newTeams = selectedTeams.includes('all') 
        ? [teamId]
        : selectedTeams.includes(teamId)
          ? selectedTeams.filter(id => id !== teamId)
          : [...selectedTeams.filter(id => id !== 'all'), teamId];
      
      onTeamsChange(newTeams.length === 0 ? ['all'] : newTeams);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title and Navigation */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Planning</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateMonth('prev')}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
              <SelectTrigger className="w-[90px]">
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
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateMonth('next')}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {/* Team Selection */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Équipes:</Label>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={selectedTeams.includes('all') ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleTeamToggle('all')}
              >
                Toutes
              </Badge>
              {teams.map(team => (
                <Badge
                  key={team.id}
                  variant={selectedTeams.includes(team.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  style={{
                    backgroundColor: selectedTeams.includes(team.id) ? team.color : undefined,
                    borderColor: team.color
                  }}
                  onClick={() => handleTeamToggle(team.id)}
                >
                  {team.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border bg-gray-50 p-1">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('calendar')}
              className="h-8 px-3"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendrier
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4 mr-1" />
              Liste
            </Button>
          </div>

          {/* Weekend Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="show-weekends"
              checked={showWeekends}
              onCheckedChange={onShowWeekendsChange}
            />
            <Label htmlFor="show-weekends" className="text-sm">
              Weekends
            </Label>
          </div>

          {/* Settings */}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernScheduleHeader;
