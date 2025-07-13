import React from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4,
  className
}) => {
  const gridClasses = cn(
    'grid',
    `gap-${gap}`,
    `grid-cols-${cols.sm || 1}`,
    `md:grid-cols-${cols.md || 2}`,
    `lg:grid-cols-${cols.lg || 3}`,
    `xl:grid-cols-${cols.xl || 4}`,
    className
  )

  return <div className={gridClasses}>{children}</div>
}

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md'
}) => {
  const containerClasses = cn(
    'w-full mx-auto',
    {
      'max-w-sm': maxWidth === 'sm',
      'max-w-md': maxWidth === 'md',
      'max-w-lg': maxWidth === 'lg',
      'max-w-xl': maxWidth === 'xl',
      'max-w-2xl': maxWidth === '2xl',
      'max-w-full': maxWidth === 'full',
    },
    {
      'px-0': padding === 'none',
      'px-4': padding === 'sm',
      'px-6': padding === 'md',
      'px-8': padding === 'lg',
    },
    className
  )

  return <div className={containerClasses}>{children}</div>
}