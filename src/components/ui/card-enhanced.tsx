import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg border shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        elevated: "bg-card text-card-foreground border-border shadow-medium hover:shadow-strong",
        glass: "bg-card/60 text-card-foreground border-border/25 backdrop-blur-lg",
        gradient: "bg-gradient-to-br from-card via-muted/20 to-card text-card-foreground border-border",
        success: "bg-passage-success-light text-passage-success border-passage-success/20",
        warning: "bg-passage-warning-light text-passage-warning border-passage-warning/20",
        error: "bg-destructive/10 text-destructive border-destructive/20",
        info: "bg-primary/10 text-primary border-primary/20",
      },
      interactive: {
        true: "cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:border-primary/25 transition-all duration-300",
        false: "",
      },
      spacing: {
        none: "",
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      spacing: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, interactive, spacing, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, interactive, spacing }), className)} {...props} />
  );
}

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { spacing?: "none" | "sm" | "default" | "lg" }
>(({ className, spacing = "default", ...props }, ref) => {
  const spacingClasses = {
    none: "",
    sm: "p-3 pb-2",
    default: "p-6 pb-2",
    lg: "p-8 pb-3",
  };
  
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", spacingClasses[spacing], className)}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { 
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    gradient?: boolean;
  }
>(({ className, as: Component = "h3", gradient, ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight",
      gradient && "text-gradient",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { spacing?: "none" | "sm" | "default" | "lg" }
>(({ className, spacing = "default", ...props }, ref) => {
  const spacingClasses = {
    none: "",
    sm: "p-3 pt-0",
    default: "p-6 pt-0", 
    lg: "p-8 pt-0",
  };

  return (
    <div 
      ref={ref} 
      className={cn(spacingClasses[spacing], className)} 
      {...props} 
    />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { spacing?: "none" | "sm" | "default" | "lg" }
>(({ className, spacing = "default", ...props }, ref) => {
  const spacingClasses = {
    none: "",
    sm: "p-3 pt-0",
    default: "p-6 pt-0",
    lg: "p-8 pt-0",
  };

  return (
    <div
      ref={ref}
      className={cn("flex items-center", spacingClasses[spacing], className)}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };