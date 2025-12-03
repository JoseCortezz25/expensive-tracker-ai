/**
 * ExpenseAmount Atom Component
 *
 * Displays a formatted currency amount using Intl.NumberFormat.
 * Follows MXN (Mexican Peso) format by default.
 *
 * @module domains/expenses/components/atoms/expense-amount
 */

'use client';

import { cn } from '@/lib/utils';
import { expensesTextMap } from '../../expenses.text-map';

export interface ExpenseAmountProps {
  /**
   * The amount to display (in currency units)
   */
  amount: number;

  /**
   * Currency code (ISO 4217)
   * @default 'MXN'
   */
  currency?: string;

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: 'default' | 'muted' | 'success' | 'warning' | 'danger';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Show currency symbol
   * @default true
   */
  showCurrency?: boolean;
}

/**
 * Format amount using Intl.NumberFormat
 */
function formatAmount(
  amount: number,
  currency: string,
  showCurrency: boolean
): string {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: showCurrency ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}

/**
 * Get size classes
 */
function getSizeClasses(size: ExpenseAmountProps['size']): string {
  switch (size) {
    case 'sm':
      return 'text-sm';
    case 'md':
      return 'text-base';
    case 'lg':
      return 'text-lg font-semibold';
    case 'xl':
      return 'text-2xl font-bold';
    default:
      return 'text-base';
  }
}

/**
 * Get variant classes
 */
function getVariantClasses(variant: ExpenseAmountProps['variant']): string {
  switch (variant) {
    case 'default':
      return 'text-foreground';
    case 'muted':
      return 'text-muted-foreground';
    case 'success':
      return 'text-green-600 dark:text-green-400';
    case 'warning':
      return 'text-amber-600 dark:text-amber-400';
    case 'danger':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-foreground';
  }
}

/**
 * ExpenseAmount Component
 *
 * Renders a formatted currency amount with configurable styling.
 *
 * @example
 * ```tsx
 * <ExpenseAmount amount={1250.50} />
 * // Output: $1,250.50
 *
 * <ExpenseAmount amount={1250.50} size="lg" variant="success" />
 * // Output: $1,250.50 (large, green)
 *
 * <ExpenseAmount amount={1250.50} showCurrency={false} />
 * // Output: 1,250.50
 * ```
 */
export function ExpenseAmount({
  amount,
  currency = 'MXN',
  size = 'md',
  variant = 'default',
  className,
  showCurrency = true,
}: ExpenseAmountProps) {
  const formattedAmount = formatAmount(amount, currency, showCurrency);

  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        getSizeClasses(size),
        getVariantClasses(variant),
        className
      )}
      title={`${expensesTextMap.amountLabel}: ${formattedAmount}`}
    >
      {formattedAmount}
    </span>
  );
}

/**
 * ExpenseAmount with explicit positive indicator
 * Useful for displaying income or credits
 */
export function PositiveAmount(props: ExpenseAmountProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-green-600 dark:text-green-400">+</span>
      <ExpenseAmount {...props} variant="success" />
    </span>
  );
}

/**
 * ExpenseAmount with explicit negative indicator
 * Useful for displaying expenses or debits
 */
export function NegativeAmount(props: ExpenseAmountProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-red-600 dark:text-red-400">-</span>
      <ExpenseAmount {...props} variant="danger" />
    </span>
  );
}
