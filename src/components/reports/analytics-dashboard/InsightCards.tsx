import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';

interface InsightsData {
  totalHours: number;
  totalPlannedHours: number;
  completionRate: number;
  blankSheets: number;
  averageHoursPerVisit: number;
  teamProductivity: Array<{ team: string; hours: number; visits: number }>;
  totalVisits: number;
  activeProjects: number;
}

interface InsightCardsProps {
  insights: InsightsData;
}

const InsightCards: React.FC<InsightCardsProps> = ({ insights }) => {
  const {
    totalHours,
    totalPlannedHours,
    completionRate,
    blankSheets,
    averageHoursPerVisit,
    teamProductivity,
    totalVisits,
    activeProjects
  } = insights;

  // Generate automatic insights
  const generateInsights = () => {
    const insights = [];

    // Completion rate insight
    if (completionRate >= 90) {
      insights.push({
        type: 'success',
        icon: <CheckCircle className="h-4 w-4" />,
        title: 'Excellent taux de réalisation',
        description: `${completionRate.toFixed(1)}% des heures prévues ont été réalisées`
      });
    } else if (completionRate < 70) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        title: 'Retard sur la planification',
        description: `Seulement ${completionRate.toFixed(1)}% des heures prévues réalisées`
      });
    }

    // Average hours insight
    if (averageHoursPerVisit > 8) {
      insights.push({
        type: 'info',
        icon: <Clock className="h-4 w-4" />,
        title: 'Visites longues',
        description: `Moyenne de ${averageHoursPerVisit.toFixed(1)}h par visite`
      });
    }

    // Blank sheets insight
    if (blankSheets > totalVisits * 0.1) {
      insights.push({
        type: 'warning',
        icon: <FileText className="h-4 w-4" />,
        title: 'Nombreuses fiches vierges',
        description: `${blankSheets} fiches vierges (${((blankSheets/totalVisits)*100).toFixed(1)}% du total)`
      });
    }

    // Team productivity insight
    const mostProductiveTeam = teamProductivity.reduce((max, team) => 
      team.hours > max.hours ? team : max, { team: '', hours: 0, visits: 0 });
    
    if (mostProductiveTeam.hours > 0) {
      insights.push({
        type: 'success',
        icon: <TrendingUp className="h-4 w-4" />,
        title: 'Équipe la plus productive',
        description: `${mostProductiveTeam.team} : ${formatNumber(mostProductiveTeam.hours)}h`
      });
    }

    return insights.slice(0, 3); // Limit to 3 insights
  };

  const autoInsights = generateInsights();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Key metrics cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de réalisation</CardTitle>
          {completionRate >= 90 ? 
            <TrendingUp className="h-4 w-4 text-green-600" /> : 
            <TrendingDown className="h-4 w-4 text-red-600" />
          }
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(totalHours)}h / {formatNumber(totalPlannedHours)}h prévues
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Moyenne par visite</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageHoursPerVisit.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground">
            {totalVisits} visites au total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            Chantiers en cours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fiches vierges</CardTitle>
          <FileText className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{blankSheets}</div>
          <p className="text-xs text-muted-foreground">
            {totalVisits > 0 ? ((blankSheets/totalVisits)*100).toFixed(1) : 0}% du total
          </p>
        </CardContent>
      </Card>

      {/* Auto-generated insights */}
      {autoInsights.length > 0 && (
        <div className="col-span-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {autoInsights.map((insight, index) => (
              <Alert key={index} className={`
                ${insight.type === 'success' ? 'border-green-200 bg-green-50' : ''}
                ${insight.type === 'warning' ? 'border-orange-200 bg-orange-50' : ''}
                ${insight.type === 'info' ? 'border-blue-200 bg-blue-50' : ''}
              `}>
                <div className="flex items-center gap-2">
                  {insight.icon}
                  <div>
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <AlertDescription className="text-xs">
                      {insight.description}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightCards;