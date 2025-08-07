import React from 'react';
import { Loader2, Check, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced loading skeleton with semantic tokens
export const LoadingSkeleton = ({ 
  className, 
  variant = "default",
  animated = true 
}: { 
  className?: string;
  variant?: "default" | "text" | "circle" | "card";
  animated?: boolean;
}) => {
  const baseClasses = "bg-muted rounded";
  const animationClasses = animated ? "animate-pulse" : "";
  
  const variantClasses = {
    default: "h-4",
    text: "h-4 w-3/4",
    circle: "h-12 w-12 rounded-full",
    card: "h-32 w-full"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses,
        className
      )}
      aria-hidden="true"
    />
  );
};

// Multi-step loading indicator
export const StepLoader = ({
  steps,
  currentStep,
  className
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div 
            key={index}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-all duration-300",
              isCurrent && "bg-primary/10 border border-primary/20",
              isCompleted && "bg-passage-success/10 border border-passage-success/20"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300",
              isCompleted && "bg-passage-success border-passage-success text-primary-foreground",
              isCurrent && "border-primary text-primary animate-pulse",
              isPending && "border-muted-foreground text-muted-foreground"
            )}>
              {isCompleted ? (
                <Check className="w-3 h-3" />
              ) : isCurrent ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors duration-300",
              isCompleted && "text-passage-success",
              isCurrent && "text-primary",
              isPending && "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Inline status indicator with smooth transitions
export const StatusLoader = ({
  status,
  message,
  showIcon = true,
  className
}: {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  showIcon?: boolean;
  className?: string;
}) => {
  const statusConfig = {
    idle: {
      icon: Clock,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      message: "En attente..."
    },
    loading: {
      icon: Loader2,
      color: "text-primary",
      bgColor: "bg-primary/10",
      message: "Chargement en cours...",
      animate: "animate-spin"
    },
    success: {
      icon: Check,
      color: "text-passage-success",
      bgColor: "bg-passage-success/10",
      message: "Terminé avec succès"
    },
    error: {
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      message: "Une erreur est survenue"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
      config.bgColor,
      className
    )}>
      {showIcon && (
        <Icon className={cn(
          "w-4 h-4",
          config.color,
          status === 'loading' && "animate-spin"
        )} />
      )}
      <span className={cn("text-sm font-medium", config.color)}>
        {message || config.message}
      </span>
    </div>
  );
};

// Page transition loader
export const PageTransition = ({
  isLoading,
  progress = 0,
  className
}: {
  isLoading: boolean;
  progress?: number;
  className?: string;
}) => {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center",
      className
    )}>
      <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-lg border">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div 
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
            style={{
              transform: `rotate(${progress * 3.6}deg)`
            }}
          ></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-medium text-foreground">Chargement en cours</h3>
          {progress > 0 && (
            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact loading dots for buttons
export const LoadingDots = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};