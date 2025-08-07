import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Hover feedback component with semantic tokens
export const HoverCard = ({ 
  children, 
  className,
  variant = "default",
  glowEffect = false 
}: { 
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "glass";
  glowEffect?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantClasses = {
    default: "hover:shadow-md hover:border-primary/20",
    elevated: "hover:shadow-lg hover:-translate-y-1 hover:shadow-primary/10",
    glass: "hover:bg-background/80 hover:backdrop-blur-lg"
  };

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out border rounded-lg",
        variantClasses[variant],
        glowEffect && isHovered && "shadow-glow",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

// Ripple effect for buttons
export const RippleButton = ({ 
  children, 
  onClick, 
  className,
  ...props 
}: { 
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  [key: string]: any;
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const rippleId = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: rippleId.current++ };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '600ms'
          }}
        />
      ))}
    </button>
  );
};

// Floating action feedback
export const FloatingFeedback = ({
  isVisible,
  message,
  type = "success",
  onDismiss,
  className
}: {
  isVisible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onDismiss?: () => void;
  className?: string;
}) => {
  useEffect(() => {
    if (isVisible && onDismiss) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  const typeConfig = {
    success: "bg-passage-success text-primary-foreground",
    error: "bg-destructive text-destructive-foreground", 
    info: "bg-primary text-primary-foreground"
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 transition-all duration-300 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
      className
    )}>
      <div className={cn(
        "px-4 py-2 rounded-lg shadow-lg border animate-slide-in-right",
        typeConfig[type]
      )}>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

// Smooth reveal animation
export const RevealOnScroll = ({ 
  children, 
  threshold = 0.1,
  className 
}: { 
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  );
};

// Interactive tooltip with hover delay
export const InteractiveTooltip = ({
  content,
  children,
  position = "top",
  delay = 300
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={cn(
          "absolute z-50 px-3 py-2 text-sm bg-popover text-popover-foreground rounded-lg shadow-lg border animate-fade-in",
          positionClasses[position]
        )}>
          {content}
        </div>
      )}
    </div>
  );
};

// Progress circle with animation
export const ProgressCircle = ({
  progress,
  size = 40,
  strokeWidth = 4,
  showText = true,
  className
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  className?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showText && (
        <span className="absolute text-xs font-medium text-foreground">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};