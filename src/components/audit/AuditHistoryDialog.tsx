import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useAuditTrail } from '@/hooks/useAuditTrail';
import { AuditEntry } from '@/types/audit';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  History, 
  User, 
  Clock, 
  FileEdit, 
  Plus, 
  Trash2, 
  Archive, 
  RotateCcw,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType?: string;
  entityId?: string;
  onRestore?: (versionData: Record<string, any>) => void;
}

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

export const AuditHistoryDialog: React.FC<AuditHistoryDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  onRestore
}) => {
  const { auditLog, isLoading, createAuditEntry } = useAuditTrail({ 
    entityType, 
    entityId 
  });

  const handleRestore = async (entry: AuditEntry) => {
    if (!onRestore) return;

    try {
      // Récupérer les données de l'état "before" de la prochaine modification
      // ou les données complètes si c'est la dernière version
      const versionData = entry.changes;
      
      await createAuditEntry({
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: 'restore',
        changes: {
          restored_from: {
            before: null,
            after: entry.timestamp
          }
        }
      });

      onRestore(versionData);
      toast.success('Version restaurée avec succès');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la restauration');
    }
  };

  const renderChangeDetails = (changes: Record<string, { before: any; after: any }>) => {
    return Object.entries(changes).map(([field, change]) => (
      <div key={field} className="space-y-1">
        <div className="text-sm font-medium text-muted-foreground capitalize">
          {field.replace('_', ' ')}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-red-50 border border-red-200 rounded">
            <div className="text-red-700 font-medium mb-1">Avant:</div>
            <div className="text-red-600">
              {typeof change.before === 'object' 
                ? JSON.stringify(change.before, null, 2)
                : String(change.before || 'N/A')
              }
            </div>
          </div>
          <div className="p-2 bg-green-50 border border-green-200 rounded">
            <div className="text-green-700 font-medium mb-1">Après:</div>
            <div className="text-green-600">
              {typeof change.after === 'object' 
                ? JSON.stringify(change.after, null, 2)
                : String(change.after || 'N/A')
              }
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des modifications
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Chargement...</div>
            </div>
          ) : auditLog.entries.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">
                Aucune modification trouvée
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {auditLog.entries.map((entry, index) => {
                const ActionIcon = actionIcons[entry.action];
                const isLast = index === auditLog.entries.length - 1;

                return (
                  <div key={entry.id} className="relative">
                    {!isLast && (
                      <div className="absolute left-6 top-12 h-full w-px bg-border" />
                    )}
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="p-2 rounded-full bg-background border">
                              <ActionIcon className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={actionColors[entry.action]}
                                >
                                  {actionLabels[entry.action]}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {entry.entityType}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {onRestore && entry.action !== 'delete' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRestore(entry)}
                                  >
                                    <RotateCcw className="h-3 w-3 mr-1" />
                                    Restaurer
                                  </Button>
                                )}
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
                              <div className="space-y-2">
                                <div className="text-sm font-medium">Modifications:</div>
                                <div className="space-y-3">
                                  {renderChangeDetails(entry.changes)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {auditLog.totalCount} modification(s) au total
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};