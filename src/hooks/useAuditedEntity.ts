import { useCallback } from 'react';
import { useAuditTrail } from './useAuditTrail';
import { supabase } from '@/integrations/supabase/client';

interface UseAuditedEntityOptions {
  entityType: 'project' | 'worklog' | 'blank_worksheet' | 'personnel' | 'team';
  entityId: string;
}

export const useAuditedEntity = ({ entityType, entityId }: UseAuditedEntityOptions) => {
  const { createAuditEntry } = useAuditTrail();

  const trackChange = useCallback(async (
    action: 'create' | 'update' | 'delete' | 'archive' | 'restore',
    beforeData: Record<string, any> | null,
    afterData: Record<string, any> | null,
    metadata?: Record<string, any>
  ) => {
    // Calculer les changements
    const changes: Record<string, { before: any; after: any }> = {};

    if (action === 'create') {
      // Pour une création, on enregistre toutes les propriétés comme "after"
      if (afterData) {
        Object.keys(afterData).forEach(key => {
          if (afterData[key] !== undefined) {
            changes[key] = { before: null, after: afterData[key] };
          }
        });
      }
    } else if (action === 'delete') {
      // Pour une suppression, on enregistre toutes les propriétés comme "before"
      if (beforeData) {
        Object.keys(beforeData).forEach(key => {
          if (beforeData[key] !== undefined) {
            changes[key] = { before: beforeData[key], after: null };
          }
        });
      }
    } else if (action === 'update' && beforeData && afterData) {
      // Pour une mise à jour, on compare before et after
      const allKeys = new Set([...Object.keys(beforeData), ...Object.keys(afterData)]);
      
      allKeys.forEach(key => {
        const before = beforeData[key];
        const after = afterData[key];
        
        // Comparer les valeurs (attention aux objets)
        const beforeStr = typeof before === 'object' ? JSON.stringify(before) : before;
        const afterStr = typeof after === 'object' ? JSON.stringify(after) : after;
        
        if (beforeStr !== afterStr) {
          changes[key] = { before, after };
        }
      });
    }

    // Créer l'entrée d'audit seulement s'il y a des changements
    if (Object.keys(changes).length > 0 || action === 'archive' || action === 'restore') {
      await createAuditEntry({
        entityType,
        entityId,
        action,
        changes,
        metadata
      });
    }
  }, [createAuditEntry, entityType, entityId]);

  const trackCreate = useCallback(async (data: Record<string, any>, metadata?: Record<string, any>) => {
    await trackChange('create', null, data, metadata);
  }, [trackChange]);

  const trackUpdate = useCallback(async (
    beforeData: Record<string, any>, 
    afterData: Record<string, any>, 
    metadata?: Record<string, any>
  ) => {
    await trackChange('update', beforeData, afterData, metadata);
  }, [trackChange]);

  const trackDelete = useCallback(async (data: Record<string, any>, metadata?: Record<string, any>) => {
    await trackChange('delete', data, null, metadata);
  }, [trackChange]);

  const trackArchive = useCallback(async (data: Record<string, any>, metadata?: Record<string, any>) => {
    await trackChange('archive', data, { ...data, is_archived: true }, metadata);
  }, [trackChange]);

  const trackRestore = useCallback(async (data: Record<string, any>, metadata?: Record<string, any>) => {
    await trackChange('restore', { ...data, is_archived: true }, data, metadata);
  }, [trackChange]);

  return {
    trackCreate,
    trackUpdate,
    trackDelete,
    trackArchive,
    trackRestore
  };
};