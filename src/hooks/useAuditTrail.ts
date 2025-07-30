import { useState, useEffect } from 'react';
import { AuditEntry, AuditLog, EntityVersion } from '@/types/audit';
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '@/utils/error';

interface UseAuditTrailOptions {
  entityType?: string;
  entityId?: string;
  userId?: string;
  limit?: number;
}

export const useAuditTrail = (options: UseAuditTrailOptions = {}) => {
  const [auditLog, setAuditLog] = useState<AuditLog>({ entries: [], totalCount: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { entityType, entityId, userId, limit = 100 } = options;

  const loadAuditEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Dans un vrai système, ceci irait dans une table audit_logs
      // Pour la démonstration, on utilise localStorage avec fallback
      const storedAudit = localStorage.getItem('audit_trail');
      const allEntries: AuditEntry[] = storedAudit ? JSON.parse(storedAudit) : [];

      let filteredEntries = allEntries;

      if (entityType) {
        filteredEntries = filteredEntries.filter(entry => entry.entityType === entityType);
      }

      if (entityId) {
        filteredEntries = filteredEntries.filter(entry => entry.entityId === entityId);
      }

      if (userId) {
        filteredEntries = filteredEntries.filter(entry => entry.userId === userId);
      }

      // Trier par timestamp décroissant
      filteredEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Limiter les résultats
      const limitedEntries = filteredEntries.slice(0, limit);

      setAuditLog({
        entries: limitedEntries,
        totalCount: filteredEntries.length
      });
    } catch (error) {
      const errorMessage = 'Erreur lors du chargement de l\'historique';
      setError(errorMessage);
      handleDatabaseError(error, 'loadAuditEntries');
    } finally {
      setIsLoading(false);
    }
  };

  const createAuditEntry = async (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'userId' | 'userEmail' | 'userName'>) => {
    try {
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const auditEntry: AuditEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        userId: user.id,
        userEmail: user.email,
        userName: user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur'
      };

      // Sauvegarder dans localStorage (en production, utiliser Supabase)
      const storedAudit = localStorage.getItem('audit_trail');
      const existingEntries: AuditEntry[] = storedAudit ? JSON.parse(storedAudit) : [];
      
      existingEntries.unshift(auditEntry);
      
      // Garder seulement les 1000 dernières entrées
      const trimmedEntries = existingEntries.slice(0, 1000);
      
      localStorage.setItem('audit_trail', JSON.stringify(trimmedEntries));

      // Recharger si on affiche les entrées correspondantes
      if (!entityType || entry.entityType === entityType) {
        if (!entityId || entry.entityId === entityId) {
          loadAuditEntries();
        }
      }
    } catch (error) {
      handleDatabaseError(error, 'createAuditEntry');
    }
  };

  const restoreVersion = async (entityType: string, entityId: string, versionData: Record<string, any>) => {
    try {
      // Dans un vrai système, on restaurerait depuis la table des versions
      // Ici on crée une entrée d'audit pour la restauration
      await createAuditEntry({
        entityType: entityType as any,
        entityId,
        action: 'restore',
        changes: {
          restored_data: {
            before: null,
            after: versionData
          }
        }
      });

      return versionData;
    } catch (error) {
      handleDatabaseError(error, 'restoreVersion');
      throw error;
    }
  };

  useEffect(() => {
    loadAuditEntries();
  }, [entityType, entityId, userId, limit]);

  return {
    auditLog,
    isLoading,
    error,
    createAuditEntry,
    restoreVersion,
    refetch: loadAuditEntries
  };
};