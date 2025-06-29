
import { useCallback } from 'react';

export const useScheduleNavigation = () => {
  const navigateToDistribution = useCallback(() => {
    // Émettre un événement personnalisé pour changer d'onglet
    const event = new CustomEvent('navigate-to-tab', { 
      detail: { tab: 'distribution' }
    });
    window.dispatchEvent(event);
  }, []);

  const navigateToTeams = useCallback(() => {
    const event = new CustomEvent('navigate-to-tab', { 
      detail: { tab: 'teams' }
    });
    window.dispatchEvent(event);
  }, []);

  const navigateToConstraints = useCallback(() => {
    const event = new CustomEvent('navigate-to-tab', { 
      detail: { tab: 'configuration' }
    });
    window.dispatchEvent(event);
  }, []);

  return {
    navigateToDistribution,
    navigateToTeams,
    navigateToConstraints
  };
};
