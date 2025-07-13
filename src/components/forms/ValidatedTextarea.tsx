import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  description?: string
  containerClassName?: string
  labelClassName?: string
}

export const ValidatedTextarea = React.forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
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
        
        <Textarea
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

ValidatedTextarea.displayName = 'ValidatedTextarea'