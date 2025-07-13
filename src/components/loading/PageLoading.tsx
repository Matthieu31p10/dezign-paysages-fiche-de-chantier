import { LoadingSpinner } from "./LoadingSpinner"

interface PageLoadingProps {
  text?: string
}

export function PageLoading({ text = "Loading page..." }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}