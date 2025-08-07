import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button-enhanced';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, X, Eye, EyeOff, Copy, Search } from 'lucide-react';

// Enhanced input with floating label and validation states
export const FloatingLabelInput = ({
  label,
  value,
  onChange,
  error,
  success,
  type = "text",
  required = false,
  className,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: string;
  type?: string;
  required?: boolean;
  className?: string;
  [key: string]: any;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pt-6 pb-2 transition-all duration-200 bg-background",
            error && "border-destructive focus:border-destructive",
            success && "border-passage-success focus:border-passage-success",
            type === 'password' && "pr-10"
          )}
          placeholder=""
          {...props}
        />
        
        <Label
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none",
            isFloating
              ? "top-2 text-xs text-muted-foreground"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            isFocused && "text-primary",
            error && "text-destructive",
            success && "text-passage-success"
          )}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>

        {type === 'password' && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}

        {success && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-passage-success" />
        )}
        {error && (
          <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
      </div>

      {(error || success) && (
        <div className={cn(
          "mt-1 text-xs transition-all duration-200",
          error && "text-destructive",
          success && "text-passage-success"
        )}>
          {error || success}
        </div>
      )}
    </div>
  );
};

// Search input with real-time suggestions
export const SmartSearchInput = ({
  value,
  onChange,
  onSelect,
  suggestions = [],
  placeholder = "Rechercher...",
  className,
  isLoading = false
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: any) => void;
  suggestions?: any[];
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsOpen(suggestions.length > 0 && value.length > 0);
    setHighlightedIndex(-1);
  }, [suggestions, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onSelect?.(suggestions[highlightedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={cn(
                "px-3 py-2 cursor-pointer transition-colors",
                index === highlightedIndex 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => {
                onSelect?.(suggestion);
                setIsOpen(false);
              }}
            >
              {typeof suggestion === 'string' ? suggestion : suggestion.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Copy-to-clipboard input
export const CopyableInput = ({
  value,
  label,
  success,
  className
}: {
  value: string;
  label?: string;
  success?: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          value={value}
          readOnly
          className="pr-20 bg-muted/50"
        />
        <Button
          type="button"
          variant={copied ? "success" : "outline"}
          size="sm"
          className="absolute right-1 top-1 h-8"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copier
            </>
          )}
        </Button>
      </div>
      {success && (
        <p className="text-sm text-passage-success">{success}</p>
      )}
    </div>
  );
};

// Form step indicator
export const FormStepIndicator = ({
  steps,
  currentStep,
  className
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300",
                isCompleted && "bg-passage-success border-passage-success text-primary-foreground",
                isCurrent && "border-primary text-primary bg-primary/10",
                !isCompleted && !isCurrent && "border-muted text-muted-foreground"
              )}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={cn(
                "mt-2 text-xs text-center transition-colors duration-300",
                isCurrent && "text-primary font-medium",
                isCompleted && "text-passage-success",
                !isCompleted && !isCurrent && "text-muted-foreground"
              )}>
                {step}
              </span>
            </div>
            {!isLast && (
              <div className={cn(
                "flex-1 h-0.5 mx-4 transition-colors duration-300",
                isCompleted ? "bg-passage-success" : "bg-muted"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};