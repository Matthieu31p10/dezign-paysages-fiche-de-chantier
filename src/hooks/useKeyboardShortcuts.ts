import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  description: string;
  action: () => void;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when user is typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !!event.ctrlKey === !!shortcut.ctrlKey;
      const altMatch = !!event.altKey === !!shortcut.altKey;
      const shiftMatch = !!event.shiftKey === !!shortcut.shiftKey;

      return keyMatch && ctrlMatch && altMatch && shiftMatch;
    });

    if (matchingShortcut) {
      if (matchingShortcut.preventDefault !== false) {
        event.preventDefault();
      }
      matchingShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  // Format shortcut for display
  const formatShortcut = useCallback((shortcut: KeyboardShortcut): string => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  }, []);

  return {
    formatShortcut
  };
};

// Predefined common shortcuts
export const createCommonShortcuts = (callbacks: {
  onSearch?: () => void;
  onNew?: () => void;
  onSave?: () => void;
  onEscape?: () => void;
  onRefresh?: () => void;
  onHelp?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [];

  if (callbacks.onSearch) {
    shortcuts.push({
      key: 'k',
      ctrlKey: true,
      description: 'Ouvrir la recherche globale',
      action: callbacks.onSearch
    });
  }

  if (callbacks.onNew) {
    shortcuts.push({
      key: 'n',
      ctrlKey: true,
      description: 'Créer un nouvel élément',
      action: callbacks.onNew
    });
  }

  if (callbacks.onSave) {
    shortcuts.push({
      key: 's',
      ctrlKey: true,
      description: 'Sauvegarder',
      action: callbacks.onSave
    });
  }

  if (callbacks.onEscape) {
    shortcuts.push({
      key: 'Escape',
      description: 'Fermer/Annuler',
      action: callbacks.onEscape,
      preventDefault: false
    });
  }

  if (callbacks.onRefresh) {
    shortcuts.push({
      key: 'r',
      ctrlKey: true,
      description: 'Actualiser',
      action: callbacks.onRefresh
    });
  }

  if (callbacks.onHelp) {
    shortcuts.push({
      key: 'F1',
      description: 'Aide',
      action: callbacks.onHelp,
      preventDefault: false
    });
  }

  return shortcuts;
};