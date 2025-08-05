import { useState, useEffect, useCallback, useRef } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  syncInProgress: boolean;
  errors: string[];
}

interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: Partial<ProjectInfo>;
  timestamp: Date;
  retryCount: number;
}

export const useProjectSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
    syncInProgress: false,
    errors: []
  });

  const pendingChangesRef = useRef<PendingChange[]>([]);
  const syncIntervalRef = useRef<NodeJS.Timeout>();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      // Remove immediate sync call to prevent loop
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync interval
  useEffect(() => {
    if (syncStatus.isOnline) {
      syncIntervalRef.current = setInterval(() => {
        if (pendingChangesRef.current.length > 0) {
          syncPendingChanges();
        }
      }, 30000); // Sync every 30 seconds
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [syncStatus.isOnline]); // Removedependent on syncPendingChanges

  const addPendingChange = useCallback((
    type: 'create' | 'update' | 'delete',
    data: Partial<ProjectInfo>
  ) => {
    const change: PendingChange = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: new Date(),
      retryCount: 0
    };

    pendingChangesRef.current.push(change);
    setSyncStatus(prev => ({ 
      ...prev, 
      pendingChanges: pendingChangesRef.current.length 
    }));

    // Remove immediate sync to prevent loops
    // syncPendingChanges will be called by the interval
  }, []);

  const syncPendingChanges = useCallback(async () => {
    if (!syncStatus.isOnline || syncStatus.syncInProgress || pendingChangesRef.current.length === 0) {
      return;
    }

    setSyncStatus(prev => ({ ...prev, syncInProgress: true, errors: [] }));

    const errors: string[] = [];
    const completedChanges: string[] = [];

    for (const change of pendingChangesRef.current) {
      try {
        switch (change.type) {
          case 'create':
            if (change.data.address && change.data.name) {
              await supabase.from('projects').insert(change.data as any);
            }
            break;
          case 'update':
            await supabase.from('projects').update(change.data as any).eq('id', change.data.id);
            break;
          case 'delete':
            await supabase.from('projects').delete().eq('id', change.data.id);
            break;
        }
        completedChanges.push(change.id);
      } catch (error) {
        console.error('Sync error for change:', change.id, error);
        
        // Increment retry count
        change.retryCount++;
        
        // Remove changes that have failed too many times
        if (change.retryCount >= 3) {
          errors.push(`Échec permanent pour ${change.type} de ${change.data.name || change.data.id}`);
          completedChanges.push(change.id);
        } else {
          errors.push(`Échec temporaire pour ${change.type} de ${change.data.name || change.data.id}`);
        }
      }
    }

    // Remove completed changes
    pendingChangesRef.current = pendingChangesRef.current.filter(
      change => !completedChanges.includes(change.id)
    );

    setSyncStatus(prev => ({
      ...prev,
      syncInProgress: false,
      lastSync: new Date(),
      pendingChanges: pendingChangesRef.current.length,
      errors
    }));

    if (completedChanges.length > 0) {
      toast.success(`${completedChanges.length} changement(s) synchronisé(s)`);
    }

    if (errors.length > 0) {
      toast.error(`${errors.length} erreur(s) de synchronisation`);
    }
  }, []);

  const forcSync = useCallback(async () => {
    await syncPendingChanges();
  }, [syncPendingChanges]);

  const clearPendingChanges = useCallback(() => {
    pendingChangesRef.current = [];
    setSyncStatus(prev => ({ ...prev, pendingChanges: 0, errors: [] }));
    toast.info('Changements en attente supprimés');
  }, []);

  const validateDataIntegrity = useCallback(async (projects: ProjectInfo[], workLogs: WorkLog[]) => {
    const issues: string[] = [];

    // Check for orphaned work logs
    const orphanedWorkLogs = workLogs.filter(log => 
      !projects.some(project => project.id === log.projectId)
    );
    
    if (orphanedWorkLogs.length > 0) {
      issues.push(`${orphanedWorkLogs.length} fiche(s) de suivi orpheline(s)`);
    }

    // Check for projects without required fields
    const incompleteProjects = projects.filter(project =>
      !project.name || !project.address
    );
    
    if (incompleteProjects.length > 0) {
      issues.push(`${incompleteProjects.length} projet(s) incomplet(s)`);
    }

    // Check for duplicate project names
    const nameGroups = projects.reduce((acc, project) => {
      acc[project.name] = (acc[project.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const duplicateNames = Object.entries(nameGroups)
      .filter(([_, count]) => count > 1)
      .map(([name]) => name);

    if (duplicateNames.length > 0) {
      issues.push(`${duplicateNames.length} nom(s) de projet dupliqué(s)`);
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }, []);

  return {
    syncStatus,
    addPendingChange,
    syncPendingChanges: forcSync,
    clearPendingChanges,
    validateDataIntegrity
  };
};