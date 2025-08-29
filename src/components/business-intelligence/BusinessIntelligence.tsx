import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, 
  Users, Calendar, Clock, Target, Award, AlertTriangle,
  Plus, Filter, Download, RefreshCw, Eye, Settings
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface KPI {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'financial' | 'operational' | 'team' | 'project';
  target?: number;
  criticalThreshold?: number;
}

interface DashboardWidget {
  id: string;
  type: 'chart' | 'kpi' | 'table' | 'gauge';
  title: string;
  size: 'small' | 'medium' | 'large';
  data: any;
  config: {
    refreshInterval: number;
    filters: string[];
    chartType?: 'line' | 'bar' | 'pie' | 'area';
  };
}

interface ForecastData {
  period: string;
  actual?: number;
  predicted: number;
  confidence: number;
}

const BusinessIntelligence: React.FC = () => {
  // Sample data for demonstrations
  const [kpis, setKpis] = useState<KPI[]>([
    {
      id: '1',
      name: 'Chiffre d\'affaires mensuel',
      value: 124500,
      previousValue: 115200,
      unit: '€',
      trend: 'up',
      category: 'financial',
      target: 130000,
      criticalThreshold: 100000
    },
    {
      id: '2',
      name: 'Projets actifs',
      value: 47,
      previousValue: 52,
      unit: '',
      trend: 'down',
      category: 'project',
      target: 50
    },
    {
      id: '3',
      name: 'Utilisation équipe',
      value: 87.5,
      previousValue: 84.2,
      unit: '%',
      trend: 'up',
      category: 'team',
      target: 85,
      criticalThreshold: 70
    },
    {
      id: '4',
      name: 'Temps moyen par projet',
      value: 28.5,
      previousValue: 31.2,
      unit: 'h',
      trend: 'down',
      category: 'operational'
    }
  ]);

  const [revenueData] = useState([
    { month: 'Jan', revenue: 98000, target: 100000, projects: 38 },
    { month: 'Fév', revenue: 105000, target: 105000, projects: 42 },
    { month: 'Mar', revenue: 112000, target: 110000, projects: 45 },
    { month: 'Avr', revenue: 118000, target: 115000, projects: 48 },
    { month: 'Mai', revenue: 124500, target: 120000, projects: 47 },
    { month: 'Jun', revenue: 0, target: 125000, projects: 0 }
  ]);

  const [teamProductivityData] = useState([
    { team: 'Équipe Alpha', projects: 18, hours: 720, efficiency: 92 },
    { team: 'Équipe Beta', projects: 15, hours: 680, efficiency: 88 },
    { team: 'Équipe Gamma', projects: 14, hours: 640, efficiency: 94 },
    { team: 'Équipe Delta', projects: 12, hours: 580, efficiency: 85 }
  ]);

  const [projectTypeDistribution] = useState([
    { name: 'Maintenance', value: 35, color: '#10B981' },
    { name: 'Installation', value: 28, color: '#3B82F6' },
    { name: 'Réparation', value: 22, color: '#F59E0B' },
    { name: 'Consultation', value: 15, color: '#EF4444' }
  ]);

  const [forecastData] = useState<ForecastData[]>([
    { period: 'Jun 2024', actual: 124500, predicted: 126000, confidence: 95 },
    { period: 'Jul 2024', predicted: 128500, confidence: 88 },
    { period: 'Aoû 2024', predicted: 132000, confidence: 82 },
    { period: 'Sep 2024', predicted: 135500, confidence: 78 },
    { period: 'Oct 2024', predicted: 139000, confidence: 74 },
    { period: 'Nov 2024', predicted: 142500, confidence: 70 }
  ]);

  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([
    {
      id: '1',
      type: 'chart',
      title: 'Évolution du chiffre d\'affaires',
      size: 'large',
      data: revenueData,
      config: {
        refreshInterval: 60,
        filters: ['monthly', 'quarterly'],
        chartType: 'area'
      }
    },
    {
      id: '2',
      type: 'kpi',
      title: 'KPIs principaux',
      size: 'medium',
      data: kpis,
      config: {
        refreshInterval: 30,
        filters: ['all', 'financial', 'operational']
      }
    }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getKPIStatus = (kpi: KPI) => {
    if (kpi.criticalThreshold && kpi.value < kpi.criticalThreshold) return 'critical';
    if (kpi.target && kpi.value < kpi.target * 0.9) return 'warning';
    if (kpi.target && kpi.value >= kpi.target) return 'success';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'success': return 'border-green-500 bg-green-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const status = getKPIStatus(kpi);
          const percentageChange = calculatePercentageChange(kpi.value, kpi.previousValue);
          
          return (
            <Card key={kpi.id} className={`border-l-4 ${getStatusColor(status)}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground truncate">
                    {kpi.name}
                  </p>
                  {getTrendIcon(kpi.trend)}
                </div>
                
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold">
                    {kpi.unit === '€' ? `${kpi.value.toLocaleString()} ${kpi.unit}` : 
                     `${kpi.value}${kpi.unit}`}
                  </p>
                  <p className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                    {kpi.trend === 'up' ? '+' : kpi.trend === 'down' ? '-' : ''}
                    {Math.abs(parseFloat(percentageChange))}%
                  </p>
                </div>
                
                {kpi.target && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Objectif</span>
                      <span>{kpi.target}{kpi.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          kpi.value >= kpi.target ? 'bg-green-500' : 
                          kpi.value >= kpi.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
          <TabsTrigger value="analytics">Analyses Avancées</TabsTrigger>
          <TabsTrigger value="forecasting">Prévisions</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tableau de Bord Exécutif</h3>
            <div className="flex space-x-2">
              <Select defaultValue="monthly">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Journalier</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
              <CardDescription>
                Comparaison avec les objectifs mensuels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k€`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString()}€`, 
                        name === 'revenue' ? 'Réalisé' : 'Objectif'
                      ]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                      name="Réalisé"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#F59E0B" 
                      strokeDasharray="5 5"
                      name="Objectif"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Productivity */}
            <Card>
              <CardHeader>
                <CardTitle>Productivité des Équipes</CardTitle>
                <CardDescription>
                  Performance et efficacité par équipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamProductivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="team" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="efficiency" fill="#3B82F6" name="Efficacité %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Project Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Projets</CardTitle>
                <CardDescription>
                  Distribution par type de projet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectTypeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {projectTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Analyses Avancées</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Analyse
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Analyse de Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux de réalisation objectifs</span>
                    <Badge className="bg-green-100 text-green-700">87%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ROI moyen projets</span>
                    <Badge className="bg-blue-100 text-blue-700">124%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Satisfaction client</span>
                    <Badge className="bg-green-100 text-green-700">94%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Équipe Gamma</p>
                      <p className="text-xs text-muted-foreground">Efficacité: 94%</p>
                    </div>
                    <Badge className="bg-gold-100 text-gold-700">🥇</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Équipe Alpha</p>
                      <p className="text-xs text-muted-foreground">Volume: 18 projets</p>
                    </div>
                    <Badge className="bg-silver-100 text-silver-700">🥈</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Équipe Beta</p>
                      <p className="text-xs text-muted-foreground">Qualité: 96%</p>
                    </div>
                    <Badge className="bg-bronze-100 text-bronze-700">🥉</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Alertes & Recommandations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">
                      Capacité équipe Delta faible
                    </p>
                    <p className="text-xs text-yellow-600">
                      Recommandation: Formation ou renfort
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Objectif mensuel en bonne voie
                    </p>
                    <p className="text-xs text-green-600">
                      87% de l'objectif atteint
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Prévisions & Modélisation</h3>
            <div className="flex space-x-2">
              <Select defaultValue="6months">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 mois</SelectItem>
                  <SelectItem value="6months">6 mois</SelectItem>
                  <SelectItem value="12months">12 mois</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recalculer
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Prévisions de Chiffre d'Affaires</CardTitle>
              <CardDescription>
                Modèle prédictif basé sur les tendances et données historiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k€`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString()}€`, 
                        name === 'actual' ? 'Réel' : 'Prévision'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Réel"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#3B82F6" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Prévision"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecastData.slice(-3).map((forecast, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{forecast.period}</span>
                      <Badge variant="outline">
                        {forecast.confidence}% fiabilité
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      {forecast.predicted.toLocaleString()}€
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Rapports Personnalisés</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Rapport
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Rapport Mensuel Exécutif', type: 'PDF', schedule: 'Mensuel', status: 'Actif' },
              { name: 'Analyse Performance Équipes', type: 'Excel', schedule: 'Hebdomadaire', status: 'Actif' },
              { name: 'Dashboard Client', type: 'Web', schedule: 'Temps réel', status: 'Actif' },
              { name: 'Rapport Financier', type: 'PDF', schedule: 'Trimestriel', status: 'Programmé' },
              { name: 'KPIs Opérationnels', type: 'JSON', schedule: 'Journalier', status: 'Actif' },
              { name: 'Analyse Prédictive', type: 'Excel', schedule: 'Mensuel', status: 'Brouillon' }
            ].map((report, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{report.name}</CardTitle>
                    <Badge variant={
                      report.status === 'Actif' ? 'default' :
                      report.status === 'Programmé' ? 'secondary' : 'outline'
                    }>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium">{report.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fréquence:</span>
                      <span className="font-medium">{report.schedule}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessIntelligence;