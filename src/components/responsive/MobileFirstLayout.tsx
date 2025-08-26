import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface MobileFirstLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'centered' | 'sidebar' | 'dashboard';
}

export const MobileFirstLayout: React.FC<MobileFirstLayoutProps> = ({
  children,
  className,
  variant = 'default'
}) => {
  const isMobile = useIsMobile();
  const { isTablet, isDesktop, isLargeScreen } = useResponsive();

  const getLayoutClasses = () => {
    const baseClasses = "w-full transition-all duration-300";
    
    switch (variant) {
      case 'centered':
        return cn(
          baseClasses,
          "mx-auto",
          isMobile ? "px-4 py-4 max-w-full" : "px-6 py-6 max-w-4xl",
          isLargeScreen && "max-w-6xl px-8 py-8"
        );
      
      case 'sidebar':
        return cn(
          baseClasses,
          "flex",
          isMobile ? "flex-col space-y-4" : "flex-row space-x-6",
          isDesktop && "space-x-8"
        );
      
      case 'dashboard':
        return cn(
          baseClasses,
          "grid gap-4",
          isMobile ? "grid-cols-1 px-3" : "grid-cols-12 px-6",
          isTablet && "px-4",
          isDesktop && "px-8 gap-6"
        );
      
      default:
        return cn(
          baseClasses,
          isMobile ? "px-3 py-4" : "px-6 py-6",
          isDesktop && "px-8 py-8"
        );
    }
  };

  return (
    <div className={cn(getLayoutClasses(), className)}>
      {children}
    </div>
  );
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3, large: 4 },
  gap = 'md'
}) => {
  const { isMobile, isTablet, isDesktop, isLargeScreen } = useResponsive();

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const getGridCols = () => {
    if (isLargeScreen) return `grid-cols-${cols.large}`;
    if (isDesktop) return `grid-cols-${cols.desktop}`;
    if (isTablet) return `grid-cols-${cols.tablet}`;
    return `grid-cols-${cols.mobile}`;
  };

  return (
    <div className={cn(
      'grid',
      getGridCols(),
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Mobile-First Card Container
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'bordered';
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  padding = 'md',
  variant = 'default'
}) => {
  const isMobile = useIsMobile();

  const paddingClasses = {
    sm: isMobile ? 'p-3' : 'p-4',
    md: isMobile ? 'p-4' : 'p-6',
    lg: isMobile ? 'p-5' : 'p-8'
  };

  const variantClasses = {
    default: 'bg-card border rounded-lg',
    elevated: 'bg-card border rounded-lg shadow-medium hover:shadow-strong transition-shadow duration-300',
    bordered: 'bg-card border-2 border-border rounded-xl'
  };

  return (
    <div className={cn(
      variantClasses[variant],
      paddingClasses[padding],
      'transition-all duration-300',
      className
    )}>
      {children}
    </div>
  );
};

// Touch-Friendly Button Container
interface TouchButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  spacing?: 'tight' | 'normal' | 'relaxed';
}

export const TouchButtonContainer: React.FC<TouchButtonProps> = ({
  children,
  className,
  size = 'md',
  spacing = 'normal'
}) => {
  const isMobile = useIsMobile();

  const sizeClasses = {
    sm: isMobile ? 'min-h-[40px] px-3 py-2' : 'min-h-[36px] px-3 py-2',
    md: isMobile ? 'min-h-[44px] px-4 py-3' : 'min-h-[40px] px-4 py-2',
    lg: isMobile ? 'min-h-[48px] px-6 py-4' : 'min-h-[44px] px-6 py-3'
  };

  const spacingClasses = {
    tight: 'space-y-1',
    normal: isMobile ? 'space-y-3' : 'space-y-2',
    relaxed: isMobile ? 'space-y-4' : 'space-y-3'
  };

  return (
    <div className={cn(
      'flex flex-col',
      spacingClasses[spacing],
      className
    )}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={cn(
          'touch-target',
          sizeClasses[size],
          'flex items-center justify-center',
          'transition-all duration-200'
        )}>
          {child}
        </div>
      ))}
    </div>
  );
};

// Responsive Text Container
interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  className,
  size = 'md'
}) => {
  const isMobile = useIsMobile();

  const sizeClasses = {
    sm: isMobile ? 'text-sm leading-5' : 'text-sm leading-6',
    md: isMobile ? 'text-base leading-6' : 'text-base leading-7',
    lg: isMobile ? 'text-lg leading-7' : 'text-lg leading-8',
    xl: isMobile ? 'text-xl leading-8' : 'text-xl leading-9'
  };

  return (
    <div className={cn(
      sizeClasses[size],
      'responsive-text',
      className
    )}>
      {children}
    </div>
  );
};