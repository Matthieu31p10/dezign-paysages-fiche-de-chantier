import { useEffect, useRef } from 'react';

/**
 * Hook for managing focus and skip links accessibility
 */
export const useFocusManagement = () => {
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  const skipToMain = () => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const announcePageChange = (pageName: string) => {
    // Create a live region announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = `Page changée vers ${pageName}`;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return {
    skipLinkRef,
    mainContentRef,
    skipToMain,
    announcePageChange
  };
};

/**
 * Hook for keyboard navigation helpers
 */
export const useKeyboardNavigation = () => {
  const handleEscapeKey = (callback: () => void) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);
  };

  const handleEnterOrSpace = (callback: () => void) => {
    return (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        callback();
      }
    };
  };

  return {
    handleEscapeKey,
    handleEnterOrSpace
  };
};