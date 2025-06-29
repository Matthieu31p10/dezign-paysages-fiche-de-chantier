
import { useCallback } from 'react';

export interface TabNavigationHook {
  navigateToTab: (tab: string) => void;
}

export const useTabNavigation = (onTabChange: (tab: string) => void): TabNavigationHook => {
  const navigateToTab = useCallback((tab: string) => {
    // Vérifier que la fonction de callback existe
    if (typeof onTabChange === 'function') {
      onTabChange(tab);
    } else {
      console.error('onTabChange callback is not defined');
    }
  }, [onTabChange]);

  return { navigateToTab };
};
