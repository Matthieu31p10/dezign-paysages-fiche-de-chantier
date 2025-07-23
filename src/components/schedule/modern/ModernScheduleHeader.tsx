
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Calendar, List, Filter } from 'lucide-react';
import { format } from 'date-fns';
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
  onNavigateMonth
}) => {
  const monthName = format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy');
  
  const handleTeamToggle = (teamId: string) => {
    if (teamId === 'all') {
      onTeamsChange(['all']);
    } else {
      const newTeams = selectedTeams.includes('all') 
        ? [teamId]
        : selectedTeams.includes(teamId)
          ? selectedTeams.filter(id => id !== teamId)
          : [...selectedTeams, teamId];
      
      onTeamsChange(newTeams.length === 0 ? ['all'] : newTeams);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Navigation et titre */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onNavigateMonth('prev')}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <h2 className="text-xl font-semibold capitalize min-w-[160px] text-center">
                {monthName}
              </h2>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => onNavigateMonth('next')}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Sélecteurs rapides */}
            <div className="flex items-center gap-2">
              <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {format(new Date(2024, i), 'MMMM')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() + i - 2;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contrôles et filtres */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Sélection d'équipes */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={selectedTeams.includes('all') ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleTeamToggle('all')}
                >
                  Toutes les équipes
                </Badge>
                {teams.map(team => (
                  <Badge
                    key={team.id}
                    variant={selectedTeams.includes(team.id) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-gray-100"
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

            {/* Mode d'affichage */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('calendar')}
                className="px-3"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Calendrier
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="px-3"
              >
                <List className="h-4 w-4 mr-1" />
                Liste
              </Button>
            </div>

            {/* Options */}
            <div className="flex items-center gap-2">
              <Switch
                id="weekends"
                checked={showWeekends}
                onCheckedChange={onShowWeekendsChange}
              />
              <Label htmlFor="weekends" className="text-sm">
                Week-ends
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernScheduleHeader;
