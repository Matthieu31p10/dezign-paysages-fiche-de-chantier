
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { ProjectInfo, WorkLog } from '@/types/models';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCurrentYear, formatDate } from '@/utils/helpers';

const YearlyAnalysisTab = () => {
  const { projectInfos, workLogs } = useApp();
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [compareYears, setCompareYears] = useState<[number, number]>([getCurrentYear() - 1, getCurrentYear()]);
  
  // Récupérer les années disponibles dans les fiches de suivi
  const getAvailableYears = () => {
    const years = workLogs.map(log => new Date(log.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a); // Ordre décroissant
  };
  
  const availableYears = getAvailableYears();
  
  // Filtrer les fiches de suivi par projet et année
  const getWorkLogsByProjectAndYear = (projectId: string, year: number) => {
    return workLogs.filter(log => {
      const logYear = new Date(log.date).getFullYear();
      return (projectId === 'all' || log.projectId === projectId) && logYear === year;
    });
  };
  
  // Calculer les statistiques mensuelles pour une année
  const getMonthlyStats = (projectId: string, year: number) => {
    const filteredLogs = getWorkLogsByProjectAndYear(projectId, year);
    
    // Initialiser les données pour chaque mois
    const monthlyData = Array(12).fill(0).map((_, idx) => ({
      month: new Date(2000, idx).toLocaleString('fr-FR', { month: 'short' }),
      visits: 0,
      hours: 0
    }));
    
    // Agréger les données
    filteredLogs.forEach(log => {
      const month = new Date(log.date).getMonth();
      monthlyData[month].visits += 1;
      monthlyData[month].hours += (log.timeTracking?.totalHours || 0);
    });
    
    return monthlyData;
  };
  
  // Préparer les données pour le graphique comparatif
  const prepareComparisonData = () => {
    const [year1, year2] = compareYears;
    const monthlyDataYear1 = getMonthlyStats(selectedProject, year1);
    const monthlyDataYear2 = getMonthlyStats(selectedProject, year2);
    
    return monthlyDataYear1.map((item, idx) => ({
      month: item.month,
      [`visites_${year1}`]: item.visits,
      [`visites_${year2}`]: monthlyDataYear2[idx].visits,
      [`heures_${year1}`]: Math.round(item.hours * 10) / 10,
      [`heures_${year2}`]: Math.round(monthlyDataYear2[idx].hours * 10) / 10,
    }));
  };
  
  // Calculer les totaux annuels
  const calculateYearlyTotals = (year: number) => {
    const stats = getMonthlyStats(selectedProject, year);
    return {
      visits: stats.reduce((sum, month) => sum + month.visits, 0),
      hours: Math.round(stats.reduce((sum, month) => sum + month.hours, 0) * 10) / 10
    };
  };
  
  const year1Totals = calculateYearlyTotals(compareYears[0]);
  const year2Totals = calculateYearlyTotals(compareYears[1]);
  
  // Calculer le pourcentage de variation
  const calculateVariation = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round((current - previous) / previous * 100);
  };
  
  const visitsVariation = calculateVariation(year2Totals.visits, year1Totals.visits);
  const hoursVariation = calculateVariation(year2Totals.hours, year1Totals.hours);
  
  const comparisonData = prepareComparisonData();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-64">
          <label className="text-sm font-medium block mb-2">Chantier</label>
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
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
          <label className="text-sm font-medium block mb-2">Année précédente</label>
          <Select
            value={compareYears[0].toString()}
            onValueChange={(value) => setCompareYears([parseInt(value), compareYears[1]])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={`prev-${year}`} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-64">
          <label className="text-sm font-medium block mb-2">Année actuelle</label>
          <Select
            value={compareYears[1].toString()}
            onValueChange={(value) => setCompareYears([compareYears[0], parseInt(value)])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={`curr-${year}`} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Comparaison annuelle</CardTitle>
            <CardDescription>
              {selectedProject === 'all' 
                ? 'Tous les chantiers' 
                : projectInfos.find(p => p.id === selectedProject)?.name || 'Chantier sélectionné'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Année {compareYears[0]}</p>
                <p className="text-lg font-semibold">{year1Totals.visits} visites</p>
                <p className="text-md">{year1Totals.hours}h travaillées</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Année {compareYears[1]}</p>
                <p className="text-lg font-semibold">
                  {year2Totals.visits} visites
                  <span className={`ml-2 text-sm ${visitsVariation > 0 ? 'text-green-500' : visitsVariation < 0 ? 'text-red-500' : ''}`}>
                    {visitsVariation > 0 ? `+${visitsVariation}%` : visitsVariation < 0 ? `${visitsVariation}%` : ''}
                  </span>
                </p>
                <p className="text-md">
                  {year2Totals.hours}h travaillées
                  <span className={`ml-2 text-sm ${hoursVariation > 0 ? 'text-green-500' : hoursVariation < 0 ? 'text-red-500' : ''}`}>
                    {hoursVariation > 0 ? `+${hoursVariation}%` : hoursVariation < 0 ? `${hoursVariation}%` : ''}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Évolution mensuelle des visites</CardTitle>
            <CardDescription>Comparaison {compareYears[0]} vs {compareYears[1]}</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey={`visites_${compareYears[0]}`} fill="#8884d8" name={`Visites ${compareYears[0]}`} />
                <Bar dataKey={`visites_${compareYears[1]}`} fill="#82ca9d" name={`Visites ${compareYears[1]}`} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Graphique des heures */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Évolution mensuelle des heures travaillées</CardTitle>
          <CardDescription>Comparaison {compareYears[0]} vs {compareYears[1]}</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={`heures_${compareYears[0]}`} fill="#0088FE" name={`Heures ${compareYears[0]}`} />
              <Bar dataKey={`heures_${compareYears[1]}`} fill="#00C49F" name={`Heures ${compareYears[1]}`} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyAnalysisTab;
