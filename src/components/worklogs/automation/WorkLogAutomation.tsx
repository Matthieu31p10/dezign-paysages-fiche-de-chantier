import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WorkLog, ProjectInfo, Team } from '@/types/models';
import { 
  Zap, 
  Bot, 
  PlayCircle, 
  PauseCircle, 
  Settings, 
  CheckCircle,
  Clock,
  Euro,
  FileText,
  Users,
  Target,
  TrendingUp,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface WorkLogAutomationProps {
  workLogs: WorkLog[];
  projects: ProjectInfo[];
  teams: Team[];
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: 'invoicing' | 'notification' | 'validation' | 'optimization';
  condition: string;
  action: string;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'condition' | 'action' | 'delay';
  config: Record<string, any>;
  order: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
  executionCount: number;
}

interface AutomationSuggestion {
  id: string;
  type: 'rule' | 'workflow' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  estimatedSaving: number;
}

export const WorkLogAutomation: React.FC<WorkLogAutomationProps> = ({
  workLogs,
  projects,
  teams
}) => {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Facturation automatique mensuelle',
      description: 'Marque automatiquement comme facturées les fiches de plus de 30 jours',
      type: 'invoicing',
      condition: 'worklog_age > 30 AND invoice_status = false',
      action: 'set_invoiced(true)',
      isActive: true,
      priority: 1,
      createdAt: new Date('2024-01-15'),
      lastTriggered: new Date('2024-01-28'),
      triggerCount: 15
    },
    {
      id: '2',
      name: 'Alerte budget projet',
      description: 'Envoie une notification quand un projet dépasse 90% de son budget',
      type: 'notification',
      condition: 'project_hours_percentage > 90',
      action: 'send_notification("Budget projet bientôt atteint")',
      isActive: true,
      priority: 2,
      createdAt: new Date('2024-01-10'),
      lastTriggered: new Date('2024-01-25'),
      triggerCount: 8
    },
    {
      id: '3',
      name: 'Validation équipe manquante',
      description: 'Marque les fiches sans personnel assigné pour révision',
      type: 'validation',
      condition: 'personnel.length = 0',
      action: 'mark_for_review()',
      isActive: false,
      priority: 3,
      createdAt: new Date('2024-01-20'),
      triggerCount: 0
    }
  ]);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Processus de facturation complet',
      description: 'Workflow automatique pour la génération et l\'envoi de factures',
      trigger: 'monthly_billing',
      steps: [
        { id: '1', name: 'Collecte des fiches non facturées', type: 'condition', config: {}, order: 1 },
        { id: '2', name: 'Génération PDF', type: 'action', config: {}, order: 2 },
        { id: '3', name: 'Envoi email client', type: 'action', config: {}, order: 3 },
        { id: '4', name: 'Mise à jour statut', type: 'action', config: {}, order: 4 }
      ],
      isActive: true,
      createdAt: new Date('2024-01-12'),
      executionCount: 3
    },
    {
      id: '2',
      name: 'Rappel visites programmées',
      description: 'Envoie des rappels automatiques pour les visites prévues',
      trigger: 'daily_check',
      steps: [
        { id: '1', name: 'Vérification visites du lendemain', type: 'condition', config: {}, order: 1 },
        { id: '2', name: 'Envoi notification équipe', type: 'action', config: {}, order: 2 },
        { id: '3', name: 'Email récapitulatif manager', type: 'action', config: {}, order: 3 }
      ],
      isActive: true,
      createdAt: new Date('2024-01-18'),
      executionCount: 12
    }
  ]);

  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [selectedRuleType, setSelectedRuleType] = useState<string>('invoicing');

  // Generate automation suggestions based on data analysis
  const automationSuggestions = useMemo(() => {
    const suggestions: AutomationSuggestion[] = [];

    // Analyze unbilled work
    const unbilledRevenue = workLogs
      .filter(log => !log.invoiced)
      .reduce((sum, log) => {
        const hourlyRate = log.hourlyRate || 45;
        const personnel = log.personnel?.length || 1;
        const hours = log.timeTracking?.totalHours || 0;
        return sum + (hourlyRate * hours * personnel);
      }, 0);

    if (unbilledRevenue > 5000) {
      suggestions.push({
        id: 'auto-billing',
        type: 'rule',
        title: 'Automatiser la facturation',
        description: `${formatCurrency(unbilledRevenue)} en attente. Créer une règle de facturation automatique pourrait améliorer la trésorerie.`,
        impact: 'high',
        category: 'Financier',
        estimatedSaving: unbilledRevenue * 0.1
      });
    }

    // Analyze project budget overruns
    const projectsOverBudget = projects.filter(project => {
      const projectLogs = workLogs.filter(log => log.projectId === project.id);
      const totalHours = projectLogs.reduce((sum, log) => {
        const personnel = log.personnel?.length || 1;
        const hours = log.timeTracking?.totalHours || 0;
        return sum + (hours * personnel);
      }, 0);
      return project.annualTotalHours && totalHours > project.annualTotalHours;
    }).length;

    if (projectsOverBudget > 0) {
      suggestions.push({
        id: 'budget-alerts',
        type: 'rule',
        title: 'Alertes budget automatiques',
        description: `${projectsOverBudget} projet(s) dépassent leur budget. Automatiser les alertes préventives.`,
        impact: 'medium',
        category: 'Gestion',
        estimatedSaving: 2000
      });
    }

    // Analyze team efficiency
    const teamEfficiency = teams.map(team => {
      const teamLogs = workLogs.filter(log => 
        log.personnel?.some(member => member.includes(team.name))
      );
      const totalHours = teamLogs.reduce((sum, log) => {
        const hours = log.timeTracking?.totalHours || 0;
        return sum + hours;
      }, 0);
      const avgHoursPerLog = teamLogs.length > 0 ? totalHours / teamLogs.length : 0;
      return { team, avgHoursPerLog };
    });

    const lowEfficiencyTeams = teamEfficiency.filter(t => t.avgHoursPerLog < 4).length;
    if (lowEfficiencyTeams > 0) {
      suggestions.push({
        id: 'team-optimization',
        type: 'optimization',
        title: 'Optimisation équipes',
        description: `${lowEfficiencyTeams} équipe(s) avec efficacité réduite. Automatiser l'analyse de performance.`,
        impact: 'medium',
        category: 'Performance',
        estimatedSaving: 1500
      });
    }

    return suggestions;
  }, [workLogs, projects, teams]);

  const toggleRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
    toast.success('Règle mise à jour');
  };

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId ? { ...workflow, isActive: !workflow.isActive } : workflow
    ));
    toast.success('Workflow mis à jour');
  };

  const executeRule = (ruleId: string) => {
    const rule = automationRules.find(r => r.id === ruleId);
    if (rule) {
      setAutomationRules(prev => prev.map(r => 
        r.id === ruleId ? { 
          ...r, 
          lastTriggered: new Date(), 
          triggerCount: r.triggerCount + 1 
        } : r
      ));
      toast.success(`Règle "${rule.name}" exécutée`);
    }
  };

  const executeWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId ? { ...w, executionCount: w.executionCount + 1 } : w
      ));
      toast.success(`Workflow "${workflow.name}" exécuté`);
    }
  };

  const applySuggestion = (suggestionId: string) => {
    const suggestion = automationSuggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      toast.success(`Suggestion "${suggestion.title}" appliquée`);
      // In a real app, this would create the actual automation rule/workflow
    }
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'invoicing': return Euro;
      case 'notification': return AlertCircle;
      case 'validation': return CheckCircle;
      case 'optimization': return TrendingUp;
      default: return Bot;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const automationStats = {
    totalRules: automationRules.length,
    activeRules: automationRules.filter(r => r.isActive).length,
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.isActive).length,
    totalExecutions: [...automationRules, ...workflows].reduce((sum, item) => 
      sum + ('triggerCount' in item ? item.triggerCount : item.executionCount), 0
    ),
    estimatedSavings: automationSuggestions.reduce((sum, s) => sum + s.estimatedSaving, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automatisation & Workflows</h2>
          <p className="text-muted-foreground">
            Optimisation intelligente et automatisation des tâches
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCreatingRule(true)} 
            variant="outline" 
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle règle
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Règles</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {automationStats.activeRules}/{automationStats.totalRules}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Workflows</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {automationStats.activeWorkflows}/{automationStats.totalWorkflows}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Exécutions</span>
            </div>
            <div className="text-2xl font-bold mt-2">{automationStats.totalExecutions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Suggestions</span>
            </div>
            <div className="text-2xl font-bold mt-2">{automationSuggestions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Économies</span>
            </div>
            <div className="text-lg font-bold mt-2">
              {formatCurrency(automationStats.estimatedSavings)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Temps gagné</span>
            </div>
            <div className="text-lg font-bold mt-2">
              {Math.round(automationStats.totalExecutions * 0.5)}h
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Règles d'automatisation</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions IA</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-4">
            {automationRules.map((rule) => {
              const IconComponent = getRuleIcon(rule.type);
              
              return (
                <Card key={rule.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${{
                          invoicing: 'bg-green-100 text-green-600',
                          notification: 'bg-orange-100 text-orange-600',
                          validation: 'bg-blue-100 text-blue-600',
                          optimization: 'bg-purple-100 text-purple-600'
                        }[rule.type]}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{rule.name}</h3>
                            <Badge variant={rule.isActive ? "default" : "secondary"}>
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">
                              Priorité {rule.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {rule.description}
                          </p>

                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Créée le {rule.createdAt.toLocaleDateString('fr-FR')}</span>
                            {rule.lastTriggered && (
                              <span>Dernière exécution : {rule.lastTriggered.toLocaleDateString('fr-FR')}</span>
                            )}
                            <span>{rule.triggerCount} exécution(s)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <Button
                          onClick={() => executeRule(rule.id)}
                          variant="outline"
                          size="sm"
                          disabled={!rule.isActive}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Exécuter
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{workflow.name}</h3>
                        <Badge variant={workflow.isActive ? "default" : "secondary"}>
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {workflow.steps.length} étape(s)
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {workflow.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {workflow.steps.map((step, index) => (
                          <Badge key={step.id} variant="outline">
                            {index + 1}. {step.name}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Créé le {workflow.createdAt.toLocaleDateString('fr-FR')}</span>
                        <span>{workflow.executionCount} exécution(s)</span>
                        <span>Déclencheur : {workflow.trigger}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={() => toggleWorkflow(workflow.id)}
                      />
                      <Button
                        onClick={() => executeWorkflow(workflow.id)}
                        variant="outline"
                        size="sm"
                        disabled={!workflow.isActive}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Exécuter
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="space-y-4">
            {automationSuggestions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune suggestion</h3>
                  <p className="text-muted-foreground">
                    L'IA n'a détecté aucune opportunité d'automatisation pour le moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              automationSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{suggestion.title}</h3>
                          <Badge variant={getImpactColor(suggestion.impact) as any}>
                            Impact {suggestion.impact}
                          </Badge>
                          <Badge variant="outline">
                            {suggestion.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-medium">
                            Économie estimée : {formatCurrency(suggestion.estimatedSaving)}
                          </span>
                          <span className="text-muted-foreground">
                            Type : {suggestion.type}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => applySuggestion(suggestion.id)}
                        variant="default"
                        size="sm"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Appliquer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des automatisations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Historique à venir</h3>
                <p className="text-muted-foreground">
                  L'historique détaillé des automatisations sera disponible dans une prochaine version.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};