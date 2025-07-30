import { useEffect, useCallback, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveConfig {
  interval?: number; // Interval en millisecondes (défaut: 10 secondes)
  enabled?: boolean; // Si l'auto-save est activé
  storageKey: string; // Clé pour le localStorage
  onSave?: () => Promise<void>; // Fonction de sauvegarde personnalisée
}

interface AutoSaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  hasDraft: boolean;
}

export const useAutoSave = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  config: AutoSaveConfig
) => {
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialValuesRef = useRef<T | null>(null);
  
  const [state, setState] = useState<AutoSaveState>({
    lastSaved: null,
    isSaving: false,
    hasUnsavedChanges: false,
    hasDraft: false
  });

  const {
    interval = 10000,
    enabled = true,
    storageKey,
    onSave
  } = config;

  // Sauvegarder dans le localStorage
  const saveDraft = useCallback(async (data: T) => {
    try {
      setState(prev => ({ ...prev, isSaving: true }));
      
      const draftData = {
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem(storageKey, JSON.stringify(draftData));
      
      // Exécuter la sauvegarde personnalisée si fournie
      if (onSave) {
        await onSave();
      }
      
      setState(prev => ({
        ...prev,
        lastSaved: new Date(),
        isSaving: false,
        hasUnsavedChanges: false,
        hasDraft: true
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
      setState(prev => ({ ...prev, isSaving: false }));
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder automatiquement les modifications",
        variant: "destructive"
      });
    }
  }, [storageKey, onSave, toast]);

  // Récupérer un brouillon du localStorage
  const loadDraft = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      
      // Vérifier que le brouillon n'est pas trop ancien (24h)
      const draftDate = new Date(parsed.timestamp);
      const now = new Date();
      const hoursDiff = (now.getTime() - draftDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        localStorage.removeItem(storageKey);
        return null;
      }
      
      setState(prev => ({ ...prev, hasDraft: true }));
      return parsed.data;
    } catch (error) {
      console.error('Erreur lors du chargement du brouillon:', error);
      return null;
    }
  }, [storageKey]);

  // Supprimer le brouillon
  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    setState(prev => ({ ...prev, hasDraft: false }));
  }, [storageKey]);

  // Restaurer le brouillon dans le formulaire
  const restoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      form.reset(draft);
      toast({
        title: "Brouillon restauré",
        description: "Vos modifications non sauvegardées ont été restaurées"
      });
    }
  }, [loadDraft, form, toast]);

  // Vérifier s'il y a des changements
  const checkForChanges = useCallback(() => {
    if (!initialValuesRef.current) return false;
    
    const currentValues = form.getValues();
    const hasChanges = JSON.stringify(currentValues) !== JSON.stringify(initialValuesRef.current);
    
    setState(prev => ({ ...prev, hasUnsavedChanges: hasChanges }));
    return hasChanges;
  }, [form]);

  // Initialiser les valeurs de référence
  useEffect(() => {
    initialValuesRef.current = form.getValues();
  }, []);

  // Watcher pour détecter les changements
  useEffect(() => {
    const subscription = form.watch(() => {
      checkForChanges();
    });
    
    return () => subscription.unsubscribe();
  }, [form, checkForChanges]);

  // Auto-save périodique
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      if (checkForChanges()) {
        const currentValues = form.getValues();
        saveDraft(currentValues);
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, checkForChanges, saveDraft, form]);

  // Sauvegarde avant fermeture
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        const currentValues = form.getValues();
        saveDraft(currentValues);
        
        e.preventDefault();
        e.returnValue = 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.hasUnsavedChanges, form, saveDraft]);

  // Sauvegarde manuelle
  const saveNow = useCallback(async () => {
    const currentValues = form.getValues();
    await saveDraft(currentValues);
  }, [form, saveDraft]);

  return {
    ...state,
    loadDraft,
    clearDraft,
    restoreDraft,
    saveNow,
    checkForChanges
  };
};