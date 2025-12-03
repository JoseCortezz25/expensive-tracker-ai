/**
 * SearchBar Molecule Component
 *
 * Search input with icon and clear button.
 * Used for filtering expenses by description.
 *
 * @module domains/expenses/components/molecules/search-bar
 */

'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { expensesTextMap } from '../../expenses.text-map';

export interface SearchBarProps {
  /**
   * Search query value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Placeholder text
   * @default 'Buscar gastos...'
   */
  placeholder?: string;

  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;

  /**
   * Show clear button when value is not empty
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Auto-focus on mount
   * @default false
   */
  autoFocus?: boolean;
}

/**
 * SearchBar Component
 *
 * Renders a search input with debouncing and clear functionality.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 *
 * <SearchBar
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Buscar por descripción..."
 * />
 *
 * <SearchBar
 *   value={search}
 *   onChange={setSearch}
 *   debounceMs={500}
 *   autoFocus
 * />
 * ```
 */
export function SearchBar({
  value,
  onChange,
  placeholder = expensesTextMap.searchPlaceholder || 'Buscar gastos...',
  debounceMs = 300,
  showClearButton = true,
  disabled = false,
  className,
  autoFocus = false,
}: SearchBarProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync local value with prop value
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  const handleChange = (newValue: string) => {
    setLocalValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  // Clear search
  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear on Escape
    if (e.key === 'Escape' && localValue) {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      {/* Search Icon */}
      <div className="pointer-events-none absolute left-3 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      {/* Input */}
      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn(
          'pl-10',
          showClearButton && localValue && 'pr-10'
        )}
        aria-label={placeholder}
      />

      {/* Clear Button */}
      {showClearButton && localValue && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 h-7 w-7 p-0"
          aria-label="Limpiar búsqueda"
          title="Limpiar (Esc)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </Button>
      )}
    </div>
  );
}

/**
 * Compact SearchBar (smaller height)
 * Useful for toolbars and dense layouts
 */
export function CompactSearchBar({
  value,
  onChange,
  placeholder,
  className,
}: Pick<SearchBarProps, 'value' | 'onChange' | 'placeholder' | 'className'>) {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn('h-9', className)}
    />
  );
}
