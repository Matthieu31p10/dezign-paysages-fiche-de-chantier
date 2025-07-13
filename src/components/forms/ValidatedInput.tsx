import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  description?: string
  containerClassName?: string
  labelClassName?: string
}

export const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, error, description, containerClassName, labelClassName, className, ...props }, ref) => {
    const hasError = Boolean(error)

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <Label 
            htmlFor={props.id} 
            className={cn(
              'text-sm font-medium',
              hasError && 'text-destructive',
              labelClassName
            )}
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <Input
          ref={ref}
          className={cn(
            hasError && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : description ? `${props.id}-description` : undefined
          }
          {...props}
        />
        
        {description && !error && (
          <p id={`${props.id}-description`} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'