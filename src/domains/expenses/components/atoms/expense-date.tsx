/**
 * ExpenseDate Atom Component
 *
 * Displays a formatted date using date-fns.
 * Supports multiple format variants and locales.
 *
 * @module domains/expenses/components/atoms/expense-date
 */

'use client';

import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { expensesTextMap } from '../../expenses.text-map';

export interface ExpenseDateProps {
  /**
   * Date to display (ISO 8601 string or Date object)
   */
  date: string | Date;

  /**
   * Format variant
   * @default 'short'
   */
  variant?: 'short' | 'long' | 'numeric' | 'relative' | 'full';

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Show calendar icon
   * @default false
   */
  showIcon?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Show time component
   * @default false
   */
  showTime?: boolean;
}

/**
 * Parse date input to Date object
 */
function parseDate(date: string | Date): Date {
  if (typeof date === 'string') {
    return parseISO(date);
  }
  return date;
}

/**
 * Format date based on variant
 */
function formatDate(
  date: Date,
  variant: ExpenseDateProps['variant'],
  showTime: boolean
): string {
  const locale = es;

  switch (variant) {
    case 'short':
      // Example: "15 ene"
      return format(date, 'd MMM', { locale });

    case 'long':
      // Example: "15 de enero de 2025"
      return format(date, "d 'de' MMMM 'de' yyyy", { locale });

    case 'numeric':
      // Example: "15/01/2025"
      return format(date, 'dd/MM/yyyy', { locale });

    case 'relative':
      // Example: "hace 2 días"
      if (isToday(date)) {
        return expensesTextMap.dateToday || 'Hoy';
      }
      if (isYesterday(date)) {
        return expensesTextMap.dateYesterday || 'Ayer';
      }
      return formatDistanceToNow(date, { addSuffix: true, locale });

    case 'full':
      // Example: "lunes, 15 de enero de 2025"
      const dateFormat = showTime
        ? "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm"
        : "EEEE, d 'de' MMMM 'de' yyyy";
      return format(date, dateFormat, { locale });

    default:
      return format(date, 'd MMM', { locale });
  }
}

/**
 * Get size classes
 */
function getSizeClasses(size: ExpenseDateProps['size']): string {
  switch (size) {
    case 'sm':
      return 'text-xs';
    case 'md':
      return 'text-sm';
    case 'lg':
      return 'text-base';
    default:
      return 'text-sm';
  }
}

/**
 * ExpenseDate Component
 *
 * Renders a formatted date with configurable styling and formats.
 *
 * @example
 * ```tsx
 * <ExpenseDate date="2025-01-15T10:30:00.000Z" />
 * // Output: "15 ene"
 *
 * <ExpenseDate date="2025-01-15T10:30:00.000Z" variant="long" />
 * // Output: "15 de enero de 2025"
 *
 * <ExpenseDate date="2025-01-15T10:30:00.000Z" variant="relative" />
 * // Output: "hace 2 días"
 *
 * <ExpenseDate date="2025-01-15T10:30:00.000Z" variant="full" showTime />
 * // Output: "lunes, 15 de enero de 2025 a las 10:30"
 * ```
 */
export function ExpenseDate({
  date,
  variant = 'short',
  size = 'md',
  showIcon = false,
  className,
  showTime = false,
}: ExpenseDateProps) {
  const parsedDate = parseDate(date);
  const formattedDate = formatDate(parsedDate, variant, showTime);

  // Full date for title tooltip
  const fullDate = format(parsedDate, "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
    locale: es,
  });

  return (
    <time
      dateTime={parsedDate.toISOString()}
      className={cn(
        'inline-flex items-center gap-1.5 text-muted-foreground',
        getSizeClasses(size),
        className
      )}
      title={fullDate}
    >
      {showIcon && (
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
          className="shrink-0"
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      )}
      <span>{formattedDate}</span>
    </time>
  );
}

/**
 * Compact date display for lists
 * Uses short format and small size
 */
export function CompactDate({ date, className }: Pick<ExpenseDateProps, 'date' | 'className'>) {
  return <ExpenseDate date={date} variant="short" size="sm" className={className} />;
}

/**
 * Relative date display (e.g., "hace 2 días")
 * Useful for showing recency
 */
export function RelativeDate({ date, className }: Pick<ExpenseDateProps, 'date' | 'className'>) {
  return <ExpenseDate date={date} variant="relative" size="sm" className={className} />;
}

/**
 * Full date display with time
 * Useful for detail views
 */
export function FullDate({ date, className }: Pick<ExpenseDateProps, 'date' | 'className'>) {
  return <ExpenseDate date={date} variant="full" size="md" showTime className={className} />;
}
