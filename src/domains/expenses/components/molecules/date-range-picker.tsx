/**
 * DateRangePicker Molecule Component
 *
 * Date range picker with calendar popover.
 * Supports selecting start and end dates for filtering.
 *
 * @module domains/expenses/components/molecules/date-range-picker
 */

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DateRange } from '../../types';
import { expensesTextMap } from '../../expenses.text-map';

export interface DateRangePickerProps {
  /**
   * Date range value
   */
  dateRange?: DateRange;

  /**
   * Date range change handler
   */
  onDateRangeChange?: (range: DateRange) => void;

  /**
   * Placeholder text
   * @default 'Selecciona rango de fechas'
   */
  placeholder?: string;

  /**
   * Disable future dates
   * @default false
   */
  disableFuture?: boolean;

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

  /**
   * Show preset buttons (Today, This Week, This Month, etc.)
   * @default true
   */
  showPresets?: boolean;
}

/**
 * Date range presets
 */
function getPresets(): Array<{ label: string; range: DateRange }> {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  return [
    {
      label: expensesTextMap.presetToday || 'Hoy',
      range: {
        from: new Date(today.setHours(0, 0, 0, 0)),
        to: new Date(today.setHours(23, 59, 59, 999)),
      },
    },
    {
      label: expensesTextMap.presetThisWeek || 'Esta semana',
      range: {
        from: new Date(today.setDate(today.getDate() - today.getDay())),
        to: new Date(),
      },
    },
    {
      label: expensesTextMap.presetThisMonth || 'Este mes',
      range: {
        from: new Date(currentYear, currentMonth, 1),
        to: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999),
      },
    },
    {
      label: expensesTextMap.presetThisYear || 'Este año',
      range: {
        from: new Date(currentYear, 0, 1),
        to: new Date(currentYear, 11, 31, 23, 59, 59, 999),
      },
    },
    {
      label: expensesTextMap.presetLastMonth || 'Mes pasado',
      range: {
        from: new Date(currentYear, currentMonth - 1, 1),
        to: new Date(currentYear, currentMonth, 0, 23, 59, 59, 999),
      },
    },
    {
      label: expensesTextMap.presetLastYear || 'Año pasado',
      range: {
        from: new Date(currentYear - 1, 0, 1),
        to: new Date(currentYear - 1, 11, 31, 23, 59, 59, 999),
      },
    },
  ];
}

/**
 * Format date range for display
 */
function formatDateRange(range?: DateRange): string {
  if (!range?.from) {
    return '';
  }

  if (!range.to) {
    return format(range.from, 'PPP', { locale: es });
  }

  return `${format(range.from, 'PP', { locale: es })} - ${format(range.to, 'PP', { locale: es })}`;
}

/**
 * DateRangePicker Component
 *
 * Renders a date range picker with calendar and presets.
 *
 * @example
 * ```tsx
 * const [dateRange, setDateRange] = useState<DateRange>();
 *
 * <DateRangePicker
 *   dateRange={dateRange}
 *   onDateRangeChange={setDateRange}
 *   placeholder="Filtrar por fecha"
 * />
 *
 * <DateRangePicker
 *   dateRange={dateRange}
 *   onDateRangeChange={setDateRange}
 *   disableFuture
 *   showPresets
 * />
 * ```
 */
export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = expensesTextMap.dateRangePlaceholder || 'Selecciona rango de fechas',
  disableFuture = false,
  minDate,
  maxDate,
  disabled = false,
  className,
  variant = 'outline',
  showPresets = true,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Determine disabled dates
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const getDisabledMatcher = () => {
    const matchers: Array<(date: Date) => boolean> = [];

    if (disableFuture) {
      matchers.push((date: Date) => date > today);
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

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range && range.from) {
      // Convert react-day-picker DateRange (undefined) to our DateRange (null)
      const convertedRange: DateRange = {
        from: range.from,
        to: range.to || null,
      };
      onDateRangeChange?.(convertedRange);
    }
  };

  const handlePresetClick = (preset: DateRange) => {
    onDateRangeChange?.(preset);
    setOpen(false);
  };

  const presets = showPresets ? getPresets() : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            'w-full justify-start text-left font-normal',
            !dateRange?.from && 'text-muted-foreground',
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
          {dateRange?.from ? (
            formatDateRange(dateRange)
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Presets Sidebar */}
          {showPresets && presets.length > 0 && (
            <div className="flex flex-col gap-1 border-r p-3">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                {expensesTextMap.presetsLabel || 'Preselecciones'}
              </p>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="justify-start font-normal"
                  onClick={() => handlePresetClick(preset.range)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}

          {/* Calendar */}
          <div className="p-3">
            <Calendar
              mode="range"
              selected={
                dateRange?.from
                  ? { from: dateRange.from, to: dateRange.to || undefined }
                  : undefined
              }
              onSelect={handleSelect}
              disabled={disabledMatcher}
              numberOfMonths={2}
              initialFocus
              locale={es}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * DateRangePicker for expense filters
 * Pre-configured with common constraints
 */
export function ExpenseDateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: Pick<DateRangePickerProps, 'dateRange' | 'onDateRangeChange' | 'className'>) {
  return (
    <DateRangePicker
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      placeholder={expensesTextMap.dateRangePlaceholder || 'Filtrar por fecha'}
      disableFuture
      minDate={new Date('1900-01-01')}
      showPresets
      className={className}
    />
  );
}
