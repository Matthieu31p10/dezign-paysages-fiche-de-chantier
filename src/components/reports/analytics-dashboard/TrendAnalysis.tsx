import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkLog } from '@/types/models';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatNumber } from '@/utils/helpers';

interface TrendAnalysisProps {
  workLogs: WorkLog[];
  selectedYear: number;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  workLogs,
  selectedYear
}) => {
  // Monthly trends for selected year
  const monthlyTrends = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: new Date(selectedYear, i, 1).toLocaleDateString('fr-FR', { month: 'long' }),
      hours: 0,
      visits: 0,
      blankSheets: 0,
      avgHoursPerVisit: 0
    }));

    const yearLogs = workLogs.filter(log => {
      const logYear = new Date(log.date).getFullYear();
      return logYear === selectedYear;
    });

    yearLogs.forEach(log => {
      const logMonth = new Date(log.date).getMonth();
      const monthData = months[logMonth];
      
      monthData.hours += log.timeTracking?.totalHours || 0;
      monthData.visits += 1;
      
      if (log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))) {
        monthData.blankSheets += 1;
      }
    });

    // Calculate average hours per visit
    months.forEach(month => {
      month.avgHoursPerVisit = month.visits > 0 ? month.hours / month.visits : 0;
    });

    return months;
  }, [workLogs, selectedYear]);

  // Year-over-year comparison
  const yearlyComparison = useMemo(() => {
    const years = Array.from(new Set(workLogs.map(log => new Date(log.date).getFullYear())))
      .sort()
      .slice(-5); // Last 5 years

    return years.map(year => {
      const yearLogs = workLogs.filter(log => new Date(log.date).getFullYear() === year);
      const totalHours = yearLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
      const blankSheets = yearLogs.filter(log => 
        log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
      ).length;

      return {
        year,
        hours: totalHours,
        visits: yearLogs.length,
        blankSheets,
        avgHoursPerVisit: yearLogs.length > 0 ? totalHours / yearLogs.length : 0
      };
    });
  }, [workLogs]);

  // Weekly patterns (for current year)
  const weeklyPatterns = useMemo(() => {
    const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const patterns = weekdays.map((day, index) => ({
      day,
      dayIndex: index,
      hours: 0,
      visits: 0
    }));

    const yearLogs = workLogs.filter(log => {
      const logYear = new Date(log.date).getFullYear();
      return logYear === selectedYear;
    });

    yearLogs.forEach(log => {
      const logDate = new Date(log.date);
      const dayOfWeek = (logDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      
      patterns[dayOfWeek].hours += log.timeTracking?.totalHours || 0;
      patterns[dayOfWeek].visits += 1;
    });

    return patterns;
  }, [workLogs, selectedYear]);

  return (
    <div className="space-y-6">
      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution mensuelle {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'hours' ? `${formatNumber(value as number)}h` : value,
                  name === 'hours' ? 'Heures' : 
                  name === 'visits' ? 'Visites' : 
                  name === 'avgHoursPerVisit' ? 'Moy. h/visite' : name
                ]}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="hours" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="hours"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="visits" 
                stroke="#10b981" 
                strokeWidth={2}
                name="visits"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgHoursPerVisit" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="avgHoursPerVisit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Year-over-Year Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Comparaison annuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'hours' ? `${formatNumber(value as number)}h` : value,
                    name === 'hours' ? 'Heures totales' : 
                    name === 'visits' ? 'Visites totales' : 
                    name === 'blankSheets' ? 'Fiches vierges' : name
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="hours"
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="visits"
                />
                <Line 
                  type="monotone" 
                  dataKey="blankSheets" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="blankSheets"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'hours' ? `${formatNumber(value as number)}h` : value,
                    name === 'hours' ? 'Heures' : 'Visites'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6}
                  name="hours"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des tendances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {yearlyComparison.length > 1 && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {yearlyComparison.length > 1 ? 
                      ((yearlyComparison[yearlyComparison.length - 1].hours - yearlyComparison[yearlyComparison.length - 2].hours) / yearlyComparison[yearlyComparison.length - 2].hours * 100).toFixed(1) 
                      : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Évolution heures vs année précédente</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {yearlyComparison.length > 1 ? 
                      ((yearlyComparison[yearlyComparison.length - 1].visits - yearlyComparison[yearlyComparison.length - 2].visits) / yearlyComparison[yearlyComparison.length - 2].visits * 100).toFixed(1) 
                      : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Évolution visites vs année précédente</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {monthlyTrends.filter(m => m.visits > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Mois actifs sur {selectedYear}</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;