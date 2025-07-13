import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface ValidatedSelectProps {
  label?: string
  error?: string
  description?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  containerClassName?: string
  labelClassName?: string
  triggerClassName?: string
  id?: string
}

export const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  label,
  error,
  description,
  placeholder = 'Sélectionner...',
  options,
  value,
  onValueChange,
  disabled = false,
  required = false,
  containerClassName,
  labelClassName,
  triggerClassName,
  id
}) => {
  const hasError = Boolean(error)

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <Label 
          htmlFor={id}
          className={cn(
            'text-sm font-medium',
            hasError && 'text-destructive',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger 
          id={id}
          className={cn(
            hasError && 'border-destructive focus:ring-destructive',
            triggerClassName
          )}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${id}-error` : description ? `${id}-description` : undefined
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {description && !error && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}