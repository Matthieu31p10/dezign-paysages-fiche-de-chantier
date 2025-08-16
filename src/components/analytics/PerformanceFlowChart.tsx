import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Database, 
  Server, 
  Globe, 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const PerformanceFlowChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');

  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'default',
      position: { x: 250, y: 50 },
      data: { 
        label: (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Frontend</span>
            <Badge variant="secondary" className="text-xs">98.5%</Badge>
          </div>
        )
      },
      style: { background: '#10b981', color: 'white', border: 'none' }
    },
    {
      id: '2',
      type: 'default',
      position: { x: 100, y: 150 },
      data: { 
        label: (
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>API Server</span>
            <Badge variant="secondary" className="text-xs">99.2%</Badge>
          </div>
        )
      },
      style: { background: '#3b82f6', color: 'white', border: 'none' }
    },
    {
      id: '3',
      type: 'default',
      position: { x: 400, y: 150 },
      data: { 
        label: (
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Database</span>
            <Badge variant="destructive" className="text-xs">95.1%</Badge>
          </div>
        )
      },
      style: { background: '#ef4444', color: 'white', border: 'none' }
    },
    {
      id: '4',
      type: 'default',
      position: { x: 50, y: 250 },
      data: { 
        label: (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Auth Service</span>
            <Badge variant="secondary" className="text-xs">99.8%</Badge>
          </div>
        )
      },
      style: { background: '#8b5cf6', color: 'white', border: 'none' }
    },
    {
      id: '5',
      type: 'default',
      position: { x: 200, y: 250 },
      data: { 
        label: (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>File Storage</span>
            <Badge variant="secondary" className="text-xs">97.3%</Badge>
          </div>
        )
      },
      style: { background: '#f59e0b', color: 'white', border: 'none' }
    },
    {
      id: '6',
      type: 'default',
      position: { x: 350, y: 250 },
      data: { 
        label: (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Scheduler</span>
            <Badge variant="secondary" className="text-xs">99.5%</Badge>
          </div>
        )
      },
      style: { background: '#06b6d4', color: 'white', border: 'none' }
    }
  ];

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#10b981' } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#10b981' } },
    { id: 'e2-4', source: '2', target: '4', style: { stroke: '#3b82f6' } },
    { id: 'e2-5', source: '2', target: '5', style: { stroke: '#3b82f6' } },
    { id: 'e3-6', source: '3', target: '6', style: { stroke: '#ef4444' } },
  ];

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  const performanceMetrics = [
    { name: 'Temps de réponse API', value: '245ms', status: 'good', trend: '+5%' },
    { name: 'Disponibilité système', value: '99.2%', status: 'excellent', trend: '+0.1%' },
    { name: 'Erreurs 5xx', value: '0.03%', status: 'good', trend: '-15%' },
    { name: 'Charge CPU', value: '23%', status: 'good', trend: '-8%' },
    { name: 'Utilisation mémoire', value: '67%', status: 'warning', trend: '+12%' },
    { name: 'Requêtes/min', value: '1,247', status: 'excellent', trend: '+22%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance System</h2>
          <p className="text-muted-foreground">
            Surveillance en temps réel des performances et de la disponibilité
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 heure</SelectItem>
            <SelectItem value="24h">24 heures</SelectItem>
            <SelectItem value="7d">7 jours</SelectItem>
            <SelectItem value="30d">30 jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Architecture Flow */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Architecture système en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '400px' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                attributionPosition="bottom-left"
                style={{ backgroundColor: '#f8fafc' }}
              >
                <Controls />
                <Background />
                <MiniMap 
                  nodeColor={(node) => {
                    if (node.style?.background) return node.style.background as string;
                    return '#10b981';
                  }}
                  pannable
                  zoomable
                />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Métriques de performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {metric.name}
                    </span>
                    {getStatusIcon(metric.status)}
                  </div>
                  <div className="flex items-end justify-between">
                    <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </span>
                    <Badge 
                      variant={metric.trend.startsWith('+') ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {metric.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Configurer alertes
        </Button>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Exporter rapport
        </Button>
        <Button variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Historique complet
        </Button>
      </div>
    </div>
  );
};

export default PerformanceFlowChart;