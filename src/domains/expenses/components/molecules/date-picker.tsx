/**
 * DatePicker Molecule Component
 *
 * Single date picker with calendar popover.
 * Wraps shadcn Calendar and Popover components.
 *
 * @module domains/expenses/components/molecules/date-picker
 */

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { expensesTextMap } from '../../expenses.text-map';

export interface DatePickerProps {
  /**
   * Selected date
   */
  date?: Date;

  /**
   * Date change handler
   */
  onDateChange?: (date: Date | undefined) => void;

  /**
   * Placeholder text
   * @default 'Selecciona una fecha'
   */
  placeholder?: string;

  /**
   * Disable future dates
   * @default false
   */
  disableFuture?: boolean;

  /**
   * Disable past dates
   * @default false
   */
  disablePast?: boolean;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

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
   * Button variant
   * @default 'outline'
   */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * DatePicker Component
 *
 * Renders a date picker with calendar popover.
 *
 * @example
 * ```tsx
 * const [date, setDate] = useState<Date>();
 *
 * <DatePicker
 *   date={date}
 *   onDateChange={setDate}
 *   placeholder="Selecciona fecha de gasto"
 * />
 *
 * <DatePicker
 *   date={date}
 *   onDateChange={setDate}
 *   disableFuture
 * />
 * ```
 */
export function DatePicker({
  date,
  onDateChange,
  placeholder = expensesTextMap.datePlaceholder || 'Selecciona una fecha',
  disableFuture = false,
  disablePast = false,
  minDate,
  maxDate,
  disabled = false,
  className,
  variant = 'outline',
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Determine disabled dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDisabledMatcher = () => {
    const matchers: Array<(date: Date) => boolean> = [];

    if (disableFuture) {
      matchers.push((date: Date) => date > today);
    }

    if (disablePast) {
      matchers.push((date: Date) => date < today);
    }

    if (minDate) {
      matchers.push((date: Date) => date < minDate);
    }

    if (maxDate) {
      matchers.push((date: Date) => date > maxDate);
    }

    if (matchers.length === 0) return undefined;

    return (date: Date) => matchers.some((matcher) => matcher(date));
  };

  const disabledMatcher = getDisabledMatcher();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
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
            className="mr-2"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          {date ? format(date, 'PPP', { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            onDateChange?.(newDate);
            setOpen(false);
          }}
          disabled={disabledMatcher}
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * DatePicker for expense forms
 * Pre-configured with common expense date constraints
 */
export function ExpenseDatePicker({
  date,
  onDateChange,
  className,
}: Pick<DatePickerProps, 'date' | 'onDateChange' | 'className'>) {
  return (
    <DatePicker
      date={date}
      onDateChange={onDateChange}
      placeholder={expensesTextMap.datePlaceholder || 'Fecha del gasto'}
      disableFuture
      minDate={new Date('1900-01-01')}
      className={className}
    />
  );
}
