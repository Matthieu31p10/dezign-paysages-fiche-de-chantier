import { cn } from "@/lib/utils";

// Status indicator component with semantic design tokens
export const StatusIndicator = ({ 
  status, 
  size = "default", 
  showText = true,
  className 
}: {
  status: "active" | "recent" | "warning" | "error" | "muted";
  size?: "sm" | "default" | "lg";
  showText?: boolean;
  className?: string;
}) => {
  const statusConfig = {
    active: {
      color: "bg-passage-success",
      lightBg: "bg-passage-success-light",
      text: "Actif",
      textColor: "text-passage-success"
    },
    recent: {
      color: "bg-passage-recent", 
      lightBg: "bg-passage-recent-light",
      text: "Récent",
      textColor: "text-passage-recent"
    },
    warning: {
      color: "bg-passage-warning",
      lightBg: "bg-passage-warning-light", 
      text: "Attention",
      textColor: "text-passage-warning"
    },
    error: {
      color: "bg-destructive",
      lightBg: "bg-destructive/10",
      text: "Erreur", 
      textColor: "text-destructive"
    },
    muted: {
      color: "bg-muted-foreground",
      lightBg: "bg-muted",
      text: "Inactif",
      textColor: "text-muted-foreground"
    }
  };

  const sizeConfig = {
    sm: showText ? "px-2 py-1 text-xs" : "w-2 h-2",
    default: showText ? "px-3 py-1.5 text-sm" : "w-3 h-3", 
    lg: showText ? "px-4 py-2 text-base" : "w-4 h-4"
  };

  const config = statusConfig[status];

  if (showText) {
    return (
      <span className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200",
        config.lightBg,
        config.textColor,
        sizeConfig[size],
        className
      )}>
        <span className={cn("w-2 h-2 rounded-full", config.color)} />
        {config.text}
      </span>
    );
  }

  return (
    <span className={cn(
      "rounded-full transition-all duration-200",
      config.color,
      sizeConfig[size],
      className
    )} />
  );
};

// Progress indicator with semantic colors
export const ProgressIndicator = ({
  value,
  max = 100,
  variant = "default",
  size = "default",
  showValue = true,
  className
}: {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error";
  size?: "sm" | "default" | "lg";
  showValue?: boolean;
  className?: string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantConfig = {
    default: "bg-primary",
    success: "bg-passage-success", 
    warning: "bg-passage-warning",
    error: "bg-destructive"
  };

  const sizeConfig = {
    sm: "h-1",
    default: "h-2",
    lg: "h-3"
  };

  return (
    <div className={cn("w-full", className)}>
      {showValue && (
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeConfig[size])}>
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            variantConfig[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Metric card component 
export const MetricCard = ({
  title,
  value, 
  subtitle,
  trend,
  variant = "default",
  icon: Icon,
  className
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "success" | "warning" | "error" | "info";
  icon?: React.ComponentType<any>;
  className?: string;
}) => {
  const variantConfig = {
    default: {
      bg: "bg-card",
      iconBg: "bg-primary/10",
      iconColor: "text-primary"
    },
    success: {
      bg: "bg-passage-success-light",
      iconBg: "bg-passage-success/10", 
      iconColor: "text-passage-success"
    },
    warning: {
      bg: "bg-passage-warning-light",
      iconBg: "bg-passage-warning/10",
      iconColor: "text-passage-warning"
    },
    error: {
      bg: "bg-destructive/10",
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive"
    },
    info: {
      bg: "bg-primary/10",
      iconBg: "bg-primary/10",
      iconColor: "text-primary"
    }
  };

  const trendConfig = {
    up: { color: "text-passage-success", symbol: "↗" },
    down: { color: "text-destructive", symbol: "↘" },
    neutral: { color: "text-muted-foreground", symbol: "→" }
  };

  const config = variantConfig[variant];

  return (
    <div className={cn(
      "rounded-lg border p-4 transition-all duration-300 hover:shadow-md",
      config.bg,
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-lg", config.iconBg)}>
            <Icon className={cn("h-5 w-5", config.iconColor)} />
          </div>
        )}
      </div>
      {trend && (
        <div className={cn("flex items-center mt-2 text-sm", trendConfig[trend].color)}>
          <span className="mr-1">{trendConfig[trend].symbol}</span>
          <span>Tendance</span>
        </div>
      )}
    </div>
  );
};