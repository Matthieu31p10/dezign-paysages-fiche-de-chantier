
import { useCallback } from 'react';

export const useScheduleNavigation = () => {
  const navigateToDistribution = useCallback(() => {
    try {
      const event = new CustomEvent('navigate-to-tab', { 
        detail: { tab: 'distribution' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to navigate to distribution:', error);
    }
  }, []);

  const navigateToTeams = useCallback(() => {
    try {
      const event = new CustomEvent('navigate-to-tab', { 
        detail: { tab: 'teams' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to navigate to teams:', error);
    }
  }, []);

  const navigateToConstraints = useCallback(() => {
    try {
      const event = new CustomEvent('navigate-to-tab', { 
        detail: { tab: 'configuration' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to navigate to constraints:', error);
    }
  }, []);

  return {
    navigateToDistribution,
    navigateToTeams,
    navigateToConstraints
  };
};
