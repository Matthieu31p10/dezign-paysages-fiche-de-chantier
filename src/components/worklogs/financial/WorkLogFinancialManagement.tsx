import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkLog } from '@/types/models';
import { Euro, TrendingUp, TrendingDown, FileBarChart, Download, Calculator, Target, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface WorkLogFinancialManagementProps {
  workLogs: WorkLog[];
  viewType?: 'all' | 'suivi' | 'vierges';
}

export const WorkLogFinancialManagement: React.FC<WorkLogFinancialManagementProps> = ({
  workLogs,
  viewType = 'all'
}) => {
  // Filtrer les données selon le type de vue
  const filteredWorkLogs = useMemo(() => {
    if (viewType === 'all') return workLogs;
    
    const isBlankWorksheet = (log: WorkLog) => 
      log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'));
    
    if (viewType === 'suivi') {
      return workLogs.filter(log => !isBlankWorksheet(log));
    } else if (viewType === 'vierges') {
      return workLogs.filter(log => isBlankWorksheet(log));
    }
    
    return workLogs;
  }, [workLogs, viewType]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current-month');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    workLogs.forEach(log => {
      const year = new Date(log.date).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort().reverse();
  }, [workLogs]);

  const financialData = useMemo(() => {
    const now = new Date();
    const currentYear = parseInt(selectedYear);
    
    let periodFilteredLogs = filteredWorkLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getFullYear() === currentYear;
    });

    if (selectedPeriod === 'current-month') {
      periodFilteredLogs = periodFilteredLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === now.getMonth();
      });
    } else if (selectedPeriod === 'last-quarter') {
      const quarterStart = new Date(currentYear, Math.floor(now.getMonth() / 3) * 3 - 3, 1);
      const quarterEnd = new Date(currentYear, Math.floor(now.getMonth() / 3) * 3, 0);
      periodFilteredLogs = periodFilteredLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= quarterStart && logDate <= quarterEnd;
      });
    }

    // Calculate revenue metrics
    const totalRevenue = periodFilteredLogs.reduce((sum, log) => {
      const hourlyRate = log.hourlyRate || 45;
      const personnel = log.personnel?.length || 1;
      const hours = log.timeTracking?.totalHours || 0;
      return sum + (hourlyRate * hours * personnel);
    }, 0);

    const invoicedRevenue = periodFilteredLogs
      .filter(log => log.invoiced)
      .reduce((sum, log) => {
        const hourlyRate = log.hourlyRate || 45;
        const personnel = log.personnel?.length || 1;
        const hours = log.timeTracking?.totalHours || 0;
        return sum + (hourlyRate * hours * personnel);
      }, 0);

    const pendingRevenue = totalRevenue - invoicedRevenue;

    // Calculate costs
    const totalConsumablesCost = periodFilteredLogs.reduce((sum, log) => {
      return sum + (log.consumables?.reduce((cSum, c) => cSum + c.totalPrice, 0) || 0);
    }, 0);

    // Calculate total hours and projects
    const totalHours = periodFilteredLogs.reduce((sum, log) => {
      const personnel = log.personnel?.length || 1;
      const hours = log.timeTracking?.totalHours || 0;
      return sum + (hours * personnel);
    }, 0);

    const uniqueProjects = new Set(periodFilteredLogs.map(log => log.projectId)).size;
    const totalVisits = periodFilteredLogs.length;

    // Calculate profit margins
    const grossProfit = totalRevenue - totalConsumablesCost;
    const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100) : 0;

    // Calculate averages
    const avgRevenuePerHour = totalHours > 0 ? totalRevenue / totalHours : 0;
    const avgRevenuePerVisit = totalVisits > 0 ? totalRevenue / totalVisits : 0;

    // Invoice performance
    const invoicingRate = totalRevenue > 0 ? ((invoicedRevenue / totalRevenue) * 100) : 0;

    // Monthly breakdown
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthLogs = filteredWorkLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getFullYear() === currentYear && logDate.getMonth() === i;
      });

      const monthRevenue = monthLogs.reduce((sum, log) => {
        const hourlyRate = log.hourlyRate || 45;
        const personnel = log.personnel?.length || 1;
        const hours = log.timeTracking?.totalHours || 0;
        return sum + (hourlyRate * hours * personnel);
      }, 0);

      const monthInvoiced = monthLogs
        .filter(log => log.invoiced)
        .reduce((sum, log) => {
          const hourlyRate = log.hourlyRate || 45;
          const personnel = log.personnel?.length || 1;
          const hours = log.timeTracking?.totalHours || 0;
          return sum + (hourlyRate * hours * personnel);
        }, 0);

      return {
        month: new Date(currentYear, i, 1).toLocaleDateString('fr-FR', { month: 'short' }),
        revenue: monthRevenue,
        invoiced: monthInvoiced,
        pending: monthRevenue - monthInvoiced
      };
    });

    return {
      totalRevenue,
      invoicedRevenue,
      pendingRevenue,
      totalConsumablesCost,
      grossProfit,
      profitMargin,
      totalHours,
      uniqueProjects,
      totalVisits,
      avgRevenuePerHour,
      avgRevenuePerVisit,
      invoicingRate,
      monthlyData
    };
  }, [filteredWorkLogs, selectedPeriod, selectedYear]);

  const handleExportFinancialReport = () => {
    const reportData = {
      period: selectedPeriod,
      year: selectedYear,
      ...financialData,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-financier-${selectedYear}-${selectedPeriod}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion Financière</h2>
          <p className="text-muted-foreground">
            Analyse des revenus, coûts et marges bénéficiaires
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Mois actuel</SelectItem>
              <SelectItem value="last-quarter">Dernier trimestre</SelectItem>
              <SelectItem value="year">Année complète</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportFinancialReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="costs">Coûts & Marges</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(financialData.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {financialData.totalHours.toFixed(1)}h • {financialData.totalVisits} visites
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus facturés</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(financialData.invoicedRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {financialData.invoicingRate.toFixed(1)}% du CA
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En attente</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(financialData.pendingRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  À facturer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Marge brute</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {financialData.profitMargin.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(financialData.grossProfit)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Alerts */}
          {(financialData.pendingRevenue > financialData.invoicedRevenue || financialData.profitMargin < 20) && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes financières
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {financialData.pendingRevenue > financialData.invoicedRevenue && (
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Facturation</Badge>
                    <span className="text-sm">
                      Plus de revenus en attente ({formatCurrency(financialData.pendingRevenue)}) 
                      que facturés ({formatCurrency(financialData.invoicedRevenue)})
                    </span>
                  </div>
                )}
                {financialData.profitMargin < 20 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Marge</Badge>
                    <span className="text-sm">
                      Marge bénéficiaire faible ({financialData.profitMargin.toFixed(1)}% &lt; 20%)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance mensuelle {selectedYear}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialData.monthlyData.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="font-medium">{month.month}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">
                          {formatCurrency(month.invoiced)}
                        </span>
                        <span className="text-orange-600">
                          {formatCurrency(month.pending)}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(month.revenue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques de revenus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Revenu par heure</span>
                  <span className="font-medium">{formatCurrency(financialData.avgRevenuePerHour)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Revenu par visite</span>
                  <span className="font-medium">{formatCurrency(financialData.avgRevenuePerVisit)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Projets actifs</span>
                  <span className="font-medium">{financialData.uniqueProjects}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taux de facturation</span>
                  <Badge variant={financialData.invoicingRate > 80 ? "default" : "destructive"}>
                    {financialData.invoicingRate.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des coûts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Coût des consommables</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(financialData.totalConsumablesCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Chiffre d'affaires</span>
                  <span className="font-medium">{formatCurrency(financialData.totalRevenue)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Bénéfice brut</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(financialData.grossProfit)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marges bénéficiaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Marge brute</span>
                      <span className="font-medium">{financialData.profitMargin.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(financialData.profitMargin, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {financialData.profitMargin >= 30 ? (
                      <span className="text-green-600">✓ Excellente marge</span>
                    ) : financialData.profitMargin >= 20 ? (
                      <span className="text-yellow-600">⚠ Marge correcte</span>
                    ) : (
                      <span className="text-red-600">⚠ Marge faible</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Indicateurs clés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Heures totales</span>
                  <span className="font-medium">{financialData.totalHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Visites totales</span>
                  <span className="font-medium">{financialData.totalVisits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projets actifs</span>
                  <span className="font-medium">{financialData.uniqueProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span>Heures/visite</span>
                  <span className="font-medium">
                    {financialData.totalVisits > 0 ? (financialData.totalHours / financialData.totalVisits).toFixed(1) : '0'}h
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficacité commerciale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Taux facturation</span>
                    <span>{financialData.invoicingRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${financialData.invoicingRate}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm">
                  {financialData.invoicingRate >= 90 ? (
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  ) : financialData.invoicingRate >= 70 ? (
                    <Badge className="bg-yellow-100 text-yellow-800">Bon</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">À améliorer</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(financialData.totalRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">CA réalisé</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium">
                    {formatCurrency(financialData.pendingRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Potentiel restant</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};