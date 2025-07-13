import { Button, ButtonProps } from "@/components/ui/button"
import { LoadingSpinner } from "./LoadingSpinner"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {loading ? (loadingText || "Loading...") : children}
    </Button>
  )
}