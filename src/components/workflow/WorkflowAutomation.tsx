import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Workflow, Settings, Play, Pause, Calendar, Users, 
  FileText, AlertTriangle, CheckCircle, Clock, 
  Plus, Edit, Trash2, Activity, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: 'schedule' | 'event' | 'manual' | 'condition';
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  actions: Array<{
    type: 'assign' | 'notify' | 'create' | 'update' | 'schedule';
    target: string;
    data: any;
  }>;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  lastRun?: Date;
  runCount: number;
  successRate: number;
}

interface AutoSchedulingRule {
  id: string;
  name: string;
  projectTypes: string[];
  teamPreferences: string[];
  timeSlots: string[];
  constraints: {
    minDaysBetween: number;
    maxPerDay: number;
    skipWeekends: boolean;
    skipHolidays: boolean;
  };
  priority: number;
  isActive: boolean;
}

interface ApprovalWorkflow {
  id: string;
  name: string;
  entityType: 'project' | 'worklog' | 'expense' | 'timeoff';
  stages: Array<{
    name: string;
    approvers: string[];
    requireAll: boolean;
    timeLimit: number;
  }>;
  isActive: boolean;
  pendingApprovals: number;
}

const WorkflowAutomation: React.FC = () => {
  const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>([
    {
      id: '1',
      name: 'Auto-assign urgent projects',
      description: 'Automatically assign high-priority projects to available teams',
      trigger: 'event',
      conditions: [
        { field: 'priority', operator: 'equals', value: 'high' },
        { field: 'status', operator: 'equals', value: 'pending' }
      ],
      actions: [
        { type: 'assign', target: 'team', data: { strategy: 'least_busy' } },
        { type: 'notify', target: 'manager', data: { template: 'urgent_assignment' } }
      ],
      isActive: true,
      priority: 'high',
      lastRun: new Date(Date.now() - 3600000),
      runCount: 47,
      successRate: 94.5
    },
    {
      id: '2',
      name: 'Weekly schedule optimization',
      description: 'Optimize weekly schedules based on team availability and project deadlines',
      trigger: 'schedule',
      conditions: [
        { field: 'day_of_week', operator: 'equals', value: 'sunday' }
      ],
      actions: [
        { type: 'schedule', target: 'projects', data: { algorithm: 'genetic' } },
        { type: 'notify', target: 'teams', data: { template: 'weekly_schedule' } }
      ],
      isActive: true,
      priority: 'medium',
      lastRun: new Date(Date.now() - 86400000),
      runCount: 12,
      successRate: 91.7
    }
  ]);

  const [schedulingRules, setSchedulingRules] = useState<AutoSchedulingRule[]>([
    {
      id: '1',
      name: 'Maintenance prioritaire',
      projectTypes: ['maintenance', 'emergency'],
      teamPreferences: ['team-1', 'team-2'],
      timeSlots: ['morning', 'afternoon'],
      constraints: {
        minDaysBetween: 1,
        maxPerDay: 3,
        skipWeekends: false,
        skipHolidays: true
      },
      priority: 1,
      isActive: true
    }
  ]);

  const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>([
    {
      id: '1',
      name: 'Project Approval',
      entityType: 'project',
      stages: [
        { name: 'Manager Review', approvers: ['manager@company.com'], requireAll: true, timeLimit: 24 },
        { name: 'Client Approval', approvers: ['client@client.com'], requireAll: true, timeLimit: 72 }
      ],
      isActive: true,
      pendingApprovals: 3
    }
  ]);

  const [stats, setStats] = useState({
    totalRules: 15,
    activeRules: 12,
    todayExecutions: 47,
    successRate: 93.2,
    timeSaved: 240 // minutes
  });

  const handleToggleRule = (ruleId: string) => {
    setWorkflowRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
    toast.success('Règle mise à jour');
  };

  const handleRunRule = (ruleId: string) => {
    toast.success('Règle exécutée avec succès');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Workflow className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Règles Totales</p>
                <p className="text-2xl font-bold">{stats.totalRules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actives</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeRules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exécutions Aujourd'hui</p>
                <p className="text-2xl font-bold text-blue-600">{stats.todayExecutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de Succès</p>
                <p className="text-2xl font-bold text-purple-600">{stats.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Temps Économisé</p>
                <p className="text-2xl font-bold text-orange-600">{stats.timeSaved}min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Règles d'Automatisation</TabsTrigger>
          <TabsTrigger value="scheduling">Planification Auto</TabsTrigger>
          <TabsTrigger value="approvals">Workflows d'Approbation</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Règles d'Automatisation</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Règle
            </Button>
          </div>

          <div className="grid gap-4">
            {workflowRules.map((rule) => (
              <Card key={rule.id} className={`border-l-4 ${rule.isActive ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Workflow className={`h-5 w-5 ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <CardDescription>{rule.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(rule.priority)}>
                        {rule.priority}
                      </Badge>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">DÉCLENCHEUR</Label>
                      <p className="font-medium capitalize">{rule.trigger}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">DERNIÈRE EXÉCUTION</Label>
                      <p className="font-medium">
                        {rule.lastRun?.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">EXÉCUTIONS</Label>
                      <p className="font-medium">{rule.runCount}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">TAUX DE SUCCÈS</Label>
                      <p className="font-medium text-green-600">{rule.successRate}%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge variant="outline">{rule.conditions.length} conditions</Badge>
                      <Badge variant="outline">{rule.actions.length} actions</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleRunRule(rule.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Exécuter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Planification Automatique</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Règle de Planification
            </Button>
          </div>

          <div className="grid gap-4">
            {schedulingRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>{rule.name}</CardTitle>
                        <CardDescription>Priorité: {rule.priority}</CardDescription>
                      </div>
                    </div>
                    <Switch checked={rule.isActive} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">TYPES DE PROJETS</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.projectTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">ÉQUIPES PRÉFÉRÉES</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.teamPreferences.map((team) => (
                          <Badge key={team} variant="outline" className="text-xs">
                            {team}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">CRÉNEAUX</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.timeSlots.map((slot) => (
                          <Badge key={slot} variant="outline" className="text-xs">
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">CONTRAINTES</Label>
                      <p className="text-sm">
                        Min {rule.constraints.minDaysBetween}j, Max {rule.constraints.maxPerDay}/jour
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Workflows d'Approbation</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Workflow
            </Button>
          </div>

          <div className="grid gap-4">
            {approvalWorkflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>{workflow.name}</CardTitle>
                        <CardDescription>Type: {workflow.entityType}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {workflow.pendingApprovals > 0 && (
                        <Badge variant="destructive">
                          {workflow.pendingApprovals} en attente
                        </Badge>
                      )}
                      <Switch checked={workflow.isActive} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workflow.stages.map((stage, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{stage.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {stage.approvers.length} approbateur(s) • {stage.timeLimit}h limite
                          </p>
                        </div>
                        <Badge variant={stage.requireAll ? "default" : "secondary"}>
                          {stage.requireAll ? "Tous requis" : "Un seul requis"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques des Workflows</CardTitle>
              <CardDescription>
                Performance et métriques d'automatisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Règles les plus performantes</h4>
                  {workflowRules
                    .sort((a, b) => b.successRate - a.successRate)
                    .slice(0, 3)
                    .map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-muted-foreground">{rule.runCount} exécutions</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {rule.successRate}%
                        </Badge>
                      </div>
                    ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Économies de temps</h4>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stats.timeSaved} minutes
                    </div>
                    <p className="text-sm text-muted-foreground">
                      économisées aujourd'hui grâce à l'automatisation
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600">94.5%</div>
                      <div className="text-xs text-muted-foreground">Taux de réussite moyen</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">4.2h</div>
                      <div className="text-xs text-muted-foreground">Temps moyen économisé/jour</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowAutomation;