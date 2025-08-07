import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Smooth page transitions
export const PageTransition = ({ 
  children, 
  className,
  variant = "fade" 
}: { 
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slide" | "scale";
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const variants = {
    fade: isVisible ? "opacity-100" : "opacity-0",
    slide: isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
    scale: isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
  };

  return (
    <div className={cn(
      "transition-all duration-500 ease-out",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};

// Staggered list animations
export const StaggeredList = ({ 
  children, 
  className,
  staggerDelay = 100 
}: { 
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(React.Children.count(children)).fill(false)
  );

  useEffect(() => {
    React.Children.forEach(children, (_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newVisible = [...prev];
          newVisible[index] = true;
          return newVisible;
        });
      }, index * staggerDelay);
    });
  }, [children, staggerDelay]);

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-500 ease-out",
            visibleItems[index] 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Morphing button states
export const MorphButton = ({
  states,
  currentState,
  onStateChange,
  className
}: {
  states: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    variant?: string;
  }>;
  currentState: string;
  onStateChange: (state: string) => void;
  className?: string;
}) => {
  const currentStateData = states.find(s => s.key === currentState);

  return (
    <button
      className={cn(
        "relative overflow-hidden px-4 py-2 rounded-lg transition-all duration-300",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "transform hover:scale-105 active:scale-95",
        className
      )}
      onClick={() => {
        const currentIndex = states.findIndex(s => s.key === currentState);
        const nextIndex = (currentIndex + 1) % states.length;
        onStateChange(states[nextIndex].key);
      }}
    >
      <div className="flex items-center gap-2 transition-all duration-300">
        {currentStateData?.icon && (
          <span className="transition-transform duration-300">
            {currentStateData.icon}
          </span>
        )}
        <span className="transition-all duration-300">
          {currentStateData?.label}
        </span>
      </div>
    </button>
  );
};

// Accordion-style reveal
export const AccordionReveal = ({
  isOpen,
  children,
  duration = 300,
  className
}: {
  isOpen: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);

  useEffect(() => {
    if (!ref.current) return;

    if (isOpen) {
      const scrollHeight = ref.current.scrollHeight;
      setHeight(scrollHeight);
      
      const timer = setTimeout(() => {
        setHeight(undefined);
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setHeight(ref.current.scrollHeight);
      requestAnimationFrame(() => {
        setHeight(0);
      });
    }
  }, [isOpen, duration]);

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden transition-all ease-out", className)}
      style={{
        height,
        transitionDuration: `${duration}ms`
      }}
    >
      <div className={cn(
        "transition-opacity ease-out",
        isOpen ? "opacity-100" : "opacity-0"
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isOpen ? `${duration / 2}ms` : '0ms'
      }}>
        {children}
      </div>
    </div>
  );
};

// Parallax scroll effect
export const ParallaxElement = ({
  children,
  speed = 0.5,
  className
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      setOffset(rate);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Smooth counter animation
export const AnimatedCounter = ({
  value,
  duration = 1000,
  className,
  prefix = "",
  suffix = ""
}: {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<number>();

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;

    const updateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (endValue - startValue) * easeOut;
      setDisplayValue(Math.round(current));

      if (progress < 1) {
        ref.current = requestAnimationFrame(updateValue);
      }
    };

    ref.current = requestAnimationFrame(updateValue);

    return () => {
      if (ref.current) {
        cancelAnimationFrame(ref.current);
      }
    };
  }, [value, duration, displayValue]);

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};