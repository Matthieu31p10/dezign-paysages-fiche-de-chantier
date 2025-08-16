import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTouch } from '@/hooks/useIsTouch';

interface MobileOptimizedViewProps {
  children: React.ReactNode;
  className?: string;
}

const MobileOptimizedView: React.FC<MobileOptimizedViewProps> = ({ 
  children, 
  className = "" 
}) => {
  const isMobile = useIsMobile();
  const isTouch = useIsTouch();

  return (
    <div 
      className={`
        ${className}
        ${isMobile ? 'mobile-optimized' : ''}
        ${isTouch ? 'touch-optimized' : ''}
      `}
      style={{
        // Improve touch targets on mobile
        '--min-touch-target': isTouch ? '44px' : '32px',
        // Optimize for mobile keyboards
        '--mobile-safe-area-bottom': isMobile ? 'env(safe-area-inset-bottom, 0px)' : '0px'
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default MobileOptimizedView;