import { useState, useEffect } from 'react';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  large: number;
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  large: 1280
};

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  screenWidth: number;
  orientation: 'portrait' | 'landscape';
  isTouchDevice: boolean;
}

export const useResponsive = (breakpoints: Partial<BreakpointConfig> = {}) => {
  const config = { ...defaultBreakpoints, ...breakpoints };
  
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLarge: false,
        screenWidth: 1024,
        orientation: 'landscape' as const,
        isTouchDevice: false
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      isMobile: width < config.tablet,
      isTablet: width >= config.tablet && width < config.desktop,
      isDesktop: width >= config.desktop && width < config.large,
      isLarge: width >= config.large,
      screenWidth: width,
      orientation: width > height ? 'landscape' : 'portrait',
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        isMobile: width < config.tablet,
        isTablet: width >= config.tablet && width < config.desktop,
        isDesktop: width >= config.desktop && width < config.large,
        isLarge: width >= config.large,
        screenWidth: width,
        orientation: width > height ? 'landscape' : 'portrait',
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
      });
    };

    const handleOrientationChange = () => {
      // Délai pour laisser le temps au navigateur de s'adapter
      setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [config.desktop, config.large, config.tablet]);

  return {
    ...state,
    // Utilitaires supplémentaires
    isSmallScreen: state.isMobile || state.isTablet,
    isLargeScreen: state.isDesktop || state.isLarge,
    canHover: !state.isTouchDevice,
    prefersMobileLayout: state.isMobile || (state.isTablet && state.orientation === 'portrait')
  };
};

export default useResponsive;