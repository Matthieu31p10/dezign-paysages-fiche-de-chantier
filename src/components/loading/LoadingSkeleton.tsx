import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  lines?: number
}

export function LoadingSkeleton({ 
  className, 
  variant = "rectangular", 
  lines = 1 
}: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-muted rounded"
  
  const variantClasses = {
    text: "h-4 w-full",
    circular: "h-12 w-12 rounded-full",
    rectangular: "h-4 w-full"
  }

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              baseClasses,
              variantClasses.text,
              i === lines - 1 && "w-3/4" // Last line shorter
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} />
  )
}