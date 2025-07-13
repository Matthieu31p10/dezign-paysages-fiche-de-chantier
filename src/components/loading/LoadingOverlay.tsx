import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./LoadingSpinner"

interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  className?: string
  children: React.ReactNode
}

export function LoadingOverlay({ 
  isLoading, 
  text = "Loading...", 
  className,
  children 
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-md">
          <LoadingSpinner size="lg" text={text} />
        </div>
      )}
    </div>
  )
}