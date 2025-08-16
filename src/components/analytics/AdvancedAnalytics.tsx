import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface AdvancedAnalyticsProps {
  dateRange?: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ dateRange = '7d' }) => {
  const { data, loading, error } = useAnalytics(dateRange);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Erreur lors du chargement des données analytiques
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    return value > threshold ? (
      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{data.conversionRate.toFixed(1)}%</p>
                  {getTrendIcon(data.conversionRate, 10)}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions actives</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{data.userSessions[data.userSessions.length - 1]?.sessions || 0}</p>
                  {getTrendIcon(50, 30)}
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Durée moyenne</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{formatDuration(data.averageSessionDuration)}</p>
                  {getTrendIcon(data.averageSessionDuration, 120)}
                </div>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de rebond</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{data.bounceRate.toFixed(1)}%</p>
                  {getTrendIcon(-data.bounceRate, -40)}
                </div>
              </div>
              <MousePointer className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="traffic">Trafic</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="devices">Appareils</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Vues de pages</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.pageViews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.userSessions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pages les plus visitées</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topPages} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="page" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par appareil</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, percentage }) => `${device}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {data.deviceBreakdown.map((entry, index) => (
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
                <CardTitle>Détails par appareil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.deviceBreakdown.map((item, index) => {
                  const Icon = item.device === 'Desktop' ? Monitor : 
                             item.device === 'Mobile' ? Smartphone : Tablet;
                  
                  return (
                    <div key={item.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{item.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item.percentage}%</Badge>
                        <div 
                          className="w-20 h-2 bg-muted rounded-full overflow-hidden"
                        >
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temps passé sur le site</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.timeOnSite}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AnalyticsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-80 w-full" />
      </CardContent>
    </Card>
  </div>
);

export default AdvancedAnalytics;