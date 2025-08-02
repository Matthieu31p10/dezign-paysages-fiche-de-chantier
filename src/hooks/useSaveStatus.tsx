import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseSaveStatusOptions {
  autoSaveDelay?: number; // Délai en ms avant la sauvegarde automatique
  successMessage?: string;
  errorMessage?: string;
  showToasts?: boolean;
}

/**
 * Hook pour gérer les états de sauvegarde avec feedback visuel
 */
export const useSaveStatus = (options: UseSaveStatusOptions = {}) => {
  const {
    autoSaveDelay = 2000,
    successMessage = 'Modifications sauvegardées',
    errorMessage = 'Erreur lors de la sauvegarde',
    showToasts = true
  } = options;

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Nettoyer le timeout lors du démontage
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  /**
   * Marque qu'il y a des changements non sauvegardés
   */
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
  }, []);

  /**
   * Lance une sauvegarde manuelle
   */
  const saveNow = useCallback(async (saveFunction: () => Promise<void>) => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      setAutoSaveTimeout(null);
    }

    setSaveStatus('saving');
    
    try {
      await saveFunction();
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      
      if (showToasts) {
        toast.success(successMessage);
      }

      // Remettre à idle après 2 secondes
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setHasUnsavedChanges(true);
      
      if (showToasts) {
        toast.error(errorMessage);
      }
      
      console.error('Erreur de sauvegarde:', error);
    }
  }, [autoSaveTimeout, successMessage, errorMessage, showToasts]);

  /**
   * Lance une sauvegarde automatique après un délai
   */
  const scheduleAutoSave = useCallback((saveFunction: () => Promise<void>) => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      saveNow(saveFunction);
    }, autoSaveDelay);

    setAutoSaveTimeout(timeout);
  }, [autoSaveDelay, saveNow]);

  /**
   * Annule la sauvegarde automatique en cours
   */
  const cancelAutoSave = useCallback(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      setAutoSaveTimeout(null);
    }
  }, [autoSaveTimeout]);

  /**
   * Remet le statut à zéro
   */
  const resetStatus = useCallback(() => {
    setSaveStatus('idle');
    setHasUnsavedChanges(false);
    cancelAutoSave();
  }, [cancelAutoSave]);

  return {
    saveStatus,
    hasUnsavedChanges,
    markAsChanged,
    saveNow,
    scheduleAutoSave,
    cancelAutoSave,
    resetStatus,
    isAutoSaveScheduled: autoSaveTimeout !== null
  };
};