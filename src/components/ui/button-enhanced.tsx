import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Enhanced variants with semantic tokens
        success: "bg-passage-success text-primary-foreground shadow-sm hover:bg-passage-success/90",
        warning: "bg-passage-warning text-primary-foreground shadow-sm hover:bg-passage-warning/90",
        info: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        
        // Gradient variants
        "gradient-primary": "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-soft hover:from-primary/90 hover:to-primary/70",
        "gradient-success": "bg-gradient-to-r from-passage-success to-passage-success/80 text-primary-foreground shadow-soft hover:from-passage-success/90 hover:to-passage-success/70",
        "gradient-warning": "bg-gradient-to-r from-passage-warning to-passage-warning/80 text-primary-foreground shadow-soft hover:from-passage-warning/90 hover:to-passage-warning/70",
        
        // Glass effect variants
        "glass": "bg-background/60 backdrop-blur-lg border border-border/25 text-foreground hover:bg-background/80",
        "glass-primary": "bg-primary/20 backdrop-blur-lg border border-primary/25 text-primary hover:bg-primary/30",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
        "icon-xl": "h-12 w-12",
      },
      animation: {
        none: "",
        hover: "hover:scale-105 active:scale-95 transform transition-transform duration-150",
        pulse: "hover:animate-pulse-glow",
        float: "hover:animate-float",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };