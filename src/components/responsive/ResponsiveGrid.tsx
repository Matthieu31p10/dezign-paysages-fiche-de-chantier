import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
  gap?: 'sm' | 'md' | 'lg';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  gap = 'md'
}) => {
  const isMobile = useIsMobile();

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const gridClasses = cn(
    'grid',
    gapClasses[gap],
    // Mobile
    `grid-cols-${mobileColumns}`,
    // Tablet
    `md:grid-cols-${tabletColumns}`,
    // Desktop
    `lg:grid-cols-${desktopColumns}`,
    // Responsive padding
    isMobile ? 'p-3' : 'p-4 sm:p-6',
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;