import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        success: "border-transparent bg-passage-success text-primary-foreground shadow hover:bg-passage-success/80",
        warning: "border-transparent bg-passage-warning text-primary-foreground shadow hover:bg-passage-warning/80",
        outline: "text-foreground border-border",
        
        // Status badges avec les tokens sémantiques
        "status-active": "border-transparent bg-passage-success text-primary-foreground",
        "status-recent": "border-transparent bg-passage-recent text-primary-foreground", 
        "status-warning": "border-transparent bg-passage-warning text-primary-foreground",
        "status-error": "border-transparent bg-destructive text-destructive-foreground",
        "status-muted": "border-transparent bg-muted text-muted-foreground",
        
        // Gradient variants
        "gradient-primary": "border-transparent bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-soft",
        "gradient-success": "border-transparent bg-gradient-to-r from-passage-success to-passage-success/80 text-primary-foreground shadow-soft",
        "gradient-warning": "border-transparent bg-gradient-to-r from-passage-warning to-passage-warning/80 text-primary-foreground shadow-soft",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-1.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105 transition-transform duration-200",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, interactive, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, interactive }), className)} {...props} />
  );
}

export { Badge, badgeVariants };