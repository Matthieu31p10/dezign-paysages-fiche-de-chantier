
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Calendar, Clock, AlertCircle, Save } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

interface SchedulingRule {
  id: string;
  projectId: string;
  intervalType: 'days' | 'weeks' | 'months';
  intervalValue: number;
  startDate?: string;
  endDate?: string;
  skipWeekends: boolean;
  skipHolidays: boolean;
  preferredDays: string[];
  preferredTimes: string[];
  notes: string;
  priority: 'low' | 'medium' | 'high';
  autoAdjust: boolean;
}

const SchedulingConfiguration: React.FC = () => {
  const { projectInfos, teams } = useApp();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [rules, setRules] = useState<SchedulingRule[]>([]);
  const [currentRule, setCurrentRule] = useState<Partial<SchedulingRule>>({
    intervalType: 'weeks',
    intervalValue: 2,
    skipWeekends: true,
    skipHolidays: true,
    preferredDays: [],
    preferredTimes: [],
    notes: '',
    priority: 'medium',
    autoAdjust: true
  });

  const daysOfWeek = [
    { value: 'monday', label: 'Lundi' },
    { value: 'tuesday', label: 'Mardi' },
    { value: 'wednesday', label: 'Mercredi' },
    { value: 'thursday', label: 'Jeudi' },
    { value: 'friday', label: 'Vendredi' },
    { value: 'saturday', label: 'Samedi' },
    { value: 'sunday', label: 'Dimanche' }
  ];

  const timeSlots = [
    { value: 'morning', label: 'Matin (8h-12h)' },
    { value: 'afternoon', label: 'Après-midi (13h-17h)' },
    { value: 'evening', label: 'Soirée (17h-19h)' }
  ];

  const handleSaveRule = () => {
    if (!selectedProject) {
      toast.error("Veuillez sélectionner un projet");
      return;
    }

    const newRule: SchedulingRule = {
      id: `rule-${Date.now()}`,
      projectId: selectedProject,
      ...currentRule as SchedulingRule
    };

    setRules([...rules, newRule]);
    setCurrentRule({
      intervalType: 'weeks',
      intervalValue: 2,
      skipWeekends: true,
      skipHolidays: true,
      preferredDays: [],
      preferredTimes: [],
      notes: '',
      priority: 'medium',
      autoAdjust: true
    });
    
    toast.success("Règle de planification sauvegardée");
  };

  const togglePreferredDay = (day: string) => {
    const current = currentRule.preferredDays || [];
    if (current.includes(day)) {
      setCurrentRule({
        ...currentRule,
        preferredDays: current.filter(d => d !== day)
      });
    } else {
      setCurrentRule({
        ...currentRule,
        preferredDays: [...current, day]
      });
    }
  };

  const togglePreferredTime = (time: string) => {
    const current = currentRule.preferredTimes || [];
    if (current.includes(time)) {
      setCurrentRule({
        ...currentRule,
        preferredTimes: current.filter(t => t !== time)
      });
    } else {
      setCurrentRule({
        ...currentRule,
        preferredTimes: [...current, time]
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Configuration des consignes de chantier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="space-y-4">
            <TabsList>
              <TabsTrigger value="create">Créer une règle</TabsTrigger>
              <TabsTrigger value="existing">Règles existantes</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              {/* Sélection du projet */}
              <div className="space-y-2">
                <Label htmlFor="project">Chantier</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un chantier" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectInfos.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} - {project.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Configuration de l'espacement */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type d'intervalle</Label>
                  <Select 
                    value={currentRule.intervalType} 
                    onValueChange={(value) => setCurrentRule({...currentRule, intervalType: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Jours</SelectItem>
                      <SelectItem value="weeks">Semaines</SelectItem>
                      <SelectItem value="months">Mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Valeur d'intervalle</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentRule.intervalValue || 1}
                    onChange={(e) => setCurrentRule({
                      ...currentRule,
                      intervalValue: parseInt(e.target.value) || 1
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select 
                    value={currentRule.priority} 
                    onValueChange={(value) => setCurrentRule({...currentRule, priority: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Période de validité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début (optionnel)</Label>
                  <Input
                    type="date"
                    value={currentRule.startDate || ''}
                    onChange={(e) => setCurrentRule({
                      ...currentRule,
                      startDate: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin (optionnel)</Label>
                  <Input
                    type="date"
                    value={currentRule.endDate || ''}
                    onChange={(e) => setCurrentRule({
                      ...currentRule,
                      endDate: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Jours préférés */}
              <div className="space-y-3">
                <Label>Jours préférés</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day.value}
                      variant={currentRule.preferredDays?.includes(day.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePreferredDay(day.value)}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Créneaux horaires préférés */}
              <div className="space-y-3">
                <Label>Créneaux horaires préférés</Label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.value}
                      variant={currentRule.preferredTimes?.includes(slot.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePreferredTime(slot.value)}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {slot.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Options avancées */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="skip-weekends"
                    checked={currentRule.skipWeekends || false}
                    onCheckedChange={(checked) => setCurrentRule({
                      ...currentRule,
                      skipWeekends: checked
                    })}
                  />
                  <Label htmlFor="skip-weekends">Éviter les weekends</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="skip-holidays"
                    checked={currentRule.skipHolidays || false}
                    onCheckedChange={(checked) => setCurrentRule({
                      ...currentRule,
                      skipHolidays: checked
                    })}
                  />
                  <Label htmlFor="skip-holidays">Éviter les jours fériés</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-adjust"
                    checked={currentRule.autoAdjust || false}
                    onCheckedChange={(checked) => setCurrentRule({
                      ...currentRule,
                      autoAdjust: checked
                    })}
                  />
                  <Label htmlFor="auto-adjust">Ajustement automatique en cas de conflit</Label>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Consignes spéciales</Label>
                <Textarea
                  placeholder="Ajoutez des consignes particulières pour ce chantier..."
                  value={currentRule.notes || ''}
                  onChange={(e) => setCurrentRule({
                    ...currentRule,
                    notes: e.target.value
                  })}
                  className="min-h-20"
                />
              </div>

              <Button onClick={handleSaveRule} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder la règle
              </Button>
            </TabsContent>

            <TabsContent value="existing" className="space-y-4">
              {rules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune règle de planification configurée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.map((rule) => {
                    const project = projectInfos.find(p => p.id === rule.projectId);
                    return (
                      <Card key={rule.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{project?.name}</h4>
                            <p className="text-sm text-gray-600">{project?.address}</p>
                          </div>
                          <Badge className={getPriorityColor(rule.priority)}>
                            {rule.priority === 'high' ? 'Haute' : 
                             rule.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Intervalle:</span>
                            <p>{rule.intervalValue} {rule.intervalType === 'days' ? 'jour(s)' : 
                               rule.intervalType === 'weeks' ? 'semaine(s)' : 'mois'}</p>
                          </div>
                          
                          {rule.preferredDays.length > 0 && (
                            <div>
                              <span className="font-medium">Jours préférés:</span>
                              <p>{rule.preferredDays.join(', ')}</p>
                            </div>
                          )}
                          
                          {rule.preferredTimes.length > 0 && (
                            <div>
                              <span className="font-medium">Créneaux:</span>
                              <p>{rule.preferredTimes.map(t => 
                                timeSlots.find(s => s.value === t)?.label).join(', ')}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            {rule.skipWeekends && <Badge variant="outline" className="text-xs">Sans WE</Badge>}
                            {rule.skipHolidays && <Badge variant="outline" className="text-xs">Sans fériés</Badge>}
                            {rule.autoAdjust && <Badge variant="outline" className="text-xs">Auto-ajust</Badge>}
                          </div>
                        </div>
                        
                        {rule.notes && (
                          <div className="mt-3 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                            <div className="flex items-start">
                              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                              <p className="text-sm text-yellow-800">{rule.notes}</p>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingConfiguration;
