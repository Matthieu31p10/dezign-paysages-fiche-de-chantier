import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuditTrail } from '@/hooks/useAuditTrail';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  History, 
  Search, 
  Filter, 
  User, 
  Clock,
  FileEdit,
  Plus,
  Trash2,
  Archive,
  RotateCcw,
  Download
} from 'lucide-react';

const actionIcons = {
  create: Plus,
  update: FileEdit,
  delete: Trash2,
  archive: Archive,
  restore: RotateCcw
};

const actionLabels = {
  create: 'Création',
  update: 'Modification',
  delete: 'Suppression',
  archive: 'Archivage',
  restore: 'Restauration'
};

const actionColors = {
  create: 'bg-green-500/10 text-green-700 border-green-200',
  update: 'bg-blue-500/10 text-blue-700 border-blue-200',
  delete: 'bg-red-500/10 text-red-700 border-red-200',
  archive: 'bg-orange-500/10 text-orange-700 border-orange-200',
  restore: 'bg-purple-500/10 text-purple-700 border-purple-200'
};

const entityTypeLabels = {
  project: 'Projet',
  worklog: 'Fiche de suivi',
  blank_worksheet: 'Fiche vierge',
  personnel: 'Personnel',
  team: 'Équipe'
};

export const AuditLogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  
  const { auditLog, isLoading, refetch } = useAuditTrail({
    limit: 200
  });

  // Filtrer les entrées selon les critères
  const filteredEntries = auditLog.entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.keys(entry.changes).some(key => 
        key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesEntityType = !selectedEntityType || selectedEntityType === 'all' || entry.entityType === selectedEntityType;
    const matchesAction = !selectedAction || selectedAction === 'all' || entry.action === selectedAction;
    
    return matchesSearch && matchesEntityType && matchesAction;
  });

  const exportAuditLog = () => {
    const dataStr = JSON.stringify(filteredEntries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-log-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <History className="h-6 w-6" />
            Journal d'audit
          </h1>
          <p className="text-muted-foreground mt-1">
            Traçabilité de toutes les modifications dans l'application
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch}>
            Actualiser
          </Button>
          <Button variant="outline" onClick={exportAuditLog}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par utilisateur, ID entité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'entité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {Object.entries(entityTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les actions</SelectItem>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des entrées d'audit */}
      <Card>
        <CardHeader>
          <CardTitle>
            Historique ({filteredEntries.length} entrée(s))
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Chargement...</div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">
                Aucune entrée trouvée
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredEntries.map((entry, index) => {
                  const ActionIcon = actionIcons[entry.action];
                  const isLast = index === filteredEntries.length - 1;

                  return (
                    <div key={entry.id} className="relative">
                      {!isLast && (
                        <div className="absolute left-6 top-12 h-full w-px bg-border" />
                      )}
                      
                      <div className="flex items-start gap-4 p-4 border rounded-lg bg-background">
                        <div className="flex-shrink-0">
                          <div className="p-2 rounded-full bg-background border">
                            <ActionIcon className="h-4 w-4" />
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={actionColors[entry.action]}
                              >
                                {actionLabels[entry.action]}
                              </Badge>
                              <Badge variant="secondary">
                                {entityTypeLabels[entry.entityType]}
                              </Badge>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {entry.entityId.substring(0, 8)}...
                              </code>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {entry.userName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(entry.timestamp), {
                                addSuffix: true,
                                locale: fr
                              })}
                            </div>
                          </div>

                          {Object.keys(entry.changes).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-sm font-medium cursor-pointer hover:text-primary">
                                Voir les modifications ({Object.keys(entry.changes).length})
                              </summary>
                              <div className="mt-2 space-y-2 p-3 bg-muted/50 rounded">
                                {Object.entries(entry.changes).map(([field, change]) => (
                                  <div key={field} className="text-xs">
                                    <div className="font-medium capitalize mb-1">
                                      {field.replace('_', ' ')}:
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="p-2 bg-red-50 border border-red-200 rounded">
                                        <div className="text-red-700 font-medium">Avant:</div>
                                        <div className="text-red-600 break-all">
                                          {typeof change.before === 'object' 
                                            ? JSON.stringify(change.before)
                                            : String(change.before || 'N/A')
                                          }
                                        </div>
                                      </div>
                                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                                        <div className="text-green-700 font-medium">Après:</div>
                                        <div className="text-green-600 break-all">
                                          {typeof change.after === 'object' 
                                            ? JSON.stringify(change.after)
                                            : String(change.after || 'N/A')
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};