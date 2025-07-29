import React, { forwardRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  onFilter?: () => void;
  showClear?: boolean;
  showFilter?: boolean;
  isLoading?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ 
    className, 
    onClear, 
    onFilter,
    showClear = true,
    showFilter = false,
    isLoading = false,
    suggestions = [],
    onSuggestionSelect,
    value,
    ...props 
  }, ref) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false);

    const handleClear = () => {
      onClear?.();
      setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
      onSuggestionSelect?.(suggestion);
      setShowSuggestions(false);
    };

    const handleFocus = () => {
      if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    };

    const handleBlur = () => {
      // Delay hiding suggestions to allow click events
      setTimeout(() => setShowSuggestions(false), 150);
    };

    return (
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={ref}
            value={value}
            className={cn(
              "pl-10 pr-20",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {showFilter && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onFilter}
              >
                <Filter className="h-3 w-3" />
              </Button>
            )}
            {showClear && value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };