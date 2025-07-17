import React from 'react';

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
}

/**
 * Skip link component for keyboard navigation accessibility
 */
export const SkipLink: React.FC<SkipLinkProps> = ({ targetId, children }) => {
  const handleSkip = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleSkip}
      onKeyDown={(e) => e.key === 'Enter' && handleSkip(e)}
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md shadow-lg transition-all duration-200"
      tabIndex={0}
    >
      {children}
    </a>
  );
};

interface VisuallyHiddenProps {
  children: React.ReactNode;
  asChild?: boolean;
}

/**
 * Visually hidden component for screen reader only content
 */
export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children, asChild = false }) => {
  const Component = asChild ? React.Fragment : 'span';
  
  return (
    <Component className={asChild ? undefined : "sr-only"}>
      {children}
    </Component>
  );
};

interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
}

/**
 * Live region component for dynamic content announcements
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({ 
  children, 
  politeness = 'polite', 
  atomic = true 
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
};