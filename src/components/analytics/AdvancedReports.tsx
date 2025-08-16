import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Filter, 
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  FileText,
  Euro,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReportData {
  revenue: { month: string; amount: number; growth: number }[];
  projects: { status: string; count: number; percentage: number }[];
  team: { member: string; hours: number; efficiency: number }[];
  timeline: { week: string; completed: number; planned: number }[];
}

const AdvancedReports: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>();
  const [activeReport, setActiveReport] = useState('financial');

  // Mock data for reports
  const reportData: ReportData = {
    revenue: [
      { month: 'Jan', amount: 45000, growth: 12 },
      { month: 'Fév', amount: 52000, growth: 15 },
      { month: 'Mar', amount: 48000, growth: -8 },
      { month: 'Avr', amount: 61000, growth: 27 },
      { month: 'Mai', amount: 58000, growth: -5 },
      { month: 'Jun', amount: 67000, growth: 15 }
    ],
    projects: [
      { status: 'Terminés', count: 45, percentage: 45 },
      { status: 'En cours', count: 32, percentage: 32 },
      { status: 'En attente', count: 15, percentage: 15 },
      { status: 'Suspendus', count: 8, percentage: 8 }
    ],
    team: [
      { member: 'Jean Dupont', hours: 168, efficiency: 92 },
      { member: 'Marie Martin', hours: 156, efficiency: 88 },
      { member: 'Pierre Durand', hours: 172, efficiency: 95 },
      { member: 'Sophie Bernard', hours: 148, efficiency: 85 },
      { member: 'Luc Moreau', hours: 164, efficiency: 90 }
    ],
    timeline: [
      { week: 'S1', completed: 8, planned: 10 },
      { week: 'S2', completed: 12, planned: 12 },
      { week: 'S3', completed: 9, planned: 11 },
      { week: 'S4', completed: 15, planned: 14 },
      { week: 'S5', completed: 11, planned: 13 },
      { week: 'S6', completed: 14, planned: 15 }
    ]
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report...`);
    // In a real application, this would generate and download the report
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rapports avancés</h2>
          <p className="text-muted-foreground">
            Analyses détaillées et rapports personnalisés
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange?.from && dateRange?.to 
                  ? `${format(dateRange.from, 'dd/MM', { locale: fr })} - ${format(dateRange.to, 'dd/MM', { locale: fr })}`
                  : 'Sélectionner période'
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange as any}
                onSelect={setDateRange as any}
                locale={fr}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs value={activeReport} onValueChange={setActiveReport} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial" className="gap-2">
            <Euro className="h-4 w-4" />
            Financier
          </TabsTrigger>
          <TabsTrigger value="projects" className="gap-2">
            <FileText className="h-4 w-4" />
            Projets
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            Équipe
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution du chiffre d'affaires</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toLocaleString()} €`, 'CA']}
                    />
                    <Bar dataKey="amount" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résumé financier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">CA total</span>
                    <span className="font-medium">331 000 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Croissance moy.</span>
                    <Badge variant="default">+11.2%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Meilleur mois</span>
                    <span className="font-medium">Juin (67k€)</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => exportReport('financial')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter rapport
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des projets</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.projects}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percentage }) => `${status}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.projects.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Planification vs Réalisation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="planned" 
                      stroke="#3b82f6" 
                      strokeDasharray="5 5"
                      name="Planifié"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Réalisé"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance de l'équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.team.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{member.member}</h4>
                      <p className="text-sm text-muted-foreground">{member.hours}h travaillées</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Efficacité</div>
                        <div className="font-bold text-lg">{member.efficiency}%</div>
                      </div>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${member.efficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taux de complétion</p>
                    <p className="text-2xl font-bold">87.3%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Temps moyen/projet</p>
                    <p className="text-2xl font-bold">12.4j</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Satisfaction client</p>
                    <p className="text-2xl font-bold">4.8/5</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedReports;