import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DraftInfo {
  timestamp: string;
  version: string;
  data: any;
}

interface UseDraftRecoveryProps {
  storageKey: string;
  onRestore?: (data: any) => void;
  maxAge?: number; // En heures, défaut: 24h
}

export const useDraftRecovery = ({
  storageKey,
  onRestore,
  maxAge = 24
}: UseDraftRecoveryProps) => {
  const { toast } = useToast();
  const [availableDraft, setAvailableDraft] = useState<DraftInfo | null>(null);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);

  useEffect(() => {
    checkForDraft();
  }, [storageKey]);

  const checkForDraft = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;

      const draft: DraftInfo = JSON.parse(stored);
      
      // Vérifier l'âge du brouillon
      const draftDate = new Date(draft.timestamp);
      const now = new Date();
      const hoursDiff = (now.getTime() - draftDate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > maxAge) {
        localStorage.removeItem(storageKey);
        return;
      }

      setAvailableDraft(draft);
      setShowRecoveryDialog(true);
    } catch (error) {
      console.error('Erreur lors de la vérification du brouillon:', error);
      localStorage.removeItem(storageKey);
    }
  };

  const restoreDraft = () => {
    if (availableDraft && onRestore) {
      onRestore(availableDraft.data);
      setShowRecoveryDialog(false);
      toast({
        title: "Brouillon restauré",
        description: "Vos modifications non sauvegardées ont été restaurées"
      });
    }
  };

  const dismissDraft = () => {
    if (availableDraft) {
      localStorage.removeItem(storageKey);
      setAvailableDraft(null);
      setShowRecoveryDialog(false);
    }
  };

  const formatDraftAge = () => {
    if (!availableDraft) return '';
    
    const draftDate = new Date(availableDraft.timestamp);
    const now = new Date();
    const diffMs = now.getTime() - draftDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours > 0) {
      return `il y a ${diffHours}h${diffMinutes % 60}min`;
    } else {
      return `il y a ${diffMinutes}min`;
    }
  };

  return {
    availableDraft,
    showRecoveryDialog,
    restoreDraft,
    dismissDraft,
    formatDraftAge
  };
};