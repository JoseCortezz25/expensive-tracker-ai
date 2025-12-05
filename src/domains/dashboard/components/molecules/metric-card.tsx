/**
 * MetricCard Molecule Component
 *
 * Displays a dashboard metric with icon, label, value, and optional trend.
 * Composes Card, ExpenseAmount, and icons.
 *
 * @module domains/dashboard/components/molecules/metric-card
 */

'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ExpenseAmount } from '@/domains/expenses/components/atoms/expense-amount';
import { dashboardTextMap } from '../../dashboard.text-map';

export interface MetricCardProps {
  /**
   * Metric label
   */
  label: string;

  /**
   * Metric value (numeric)
   */
  value: number;

  /**
   * Icon component or emoji
   */
  icon?: React.ReactNode;

  /**
   * Value type for formatting
   * @default 'currency'
   */
  valueType?: 'currency' | 'number' | 'percentage';

  /**
   * Trend indicator
   * Positive number shows increase, negative shows decrease
   */
  trend?: number;

  /**
   * Trend direction interpretation
   * @default 'neutral'
   */
  trendSentiment?: 'positive' | 'negative' | 'neutral';

  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Click handler (makes card interactive)
   */
  onClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Card variant
   * @default 'default'
   */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Format value based on type
 */
function formatValue(value: number, valueType: MetricCardProps['valueType']): React.ReactNode {
  switch (valueType) {
    case 'currency':
      return <ExpenseAmount amount={value} size="xl" />;

    case 'percentage':
      return (
        <span className="font-mono text-2xl font-bold tabular-nums">
          {value.toFixed(1)}
          <span className="text-lg text-muted-foreground">%</span>
        </span>
      );

    case 'number':
      return (
        <span className="font-mono text-2xl font-bold tabular-nums">
          {new Intl.NumberFormat('es-MX').format(value)}
        </span>
      );

    default:
      return <ExpenseAmount amount={value} size="xl" />;
  }
}

/**
 * Render trend indicator
 */
function TrendIndicator({
  trend,
  sentiment,
}: {
  trend: number;
  sentiment: MetricCardProps['trendSentiment'];
}) {
  const isIncrease = trend > 0;
  const trendAbs = Math.abs(trend);

  // Determine color based on sentiment
  let colorClass = 'text-muted-foreground';
  if (sentiment === 'positive') {
    colorClass = isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  } else if (sentiment === 'negative') {
    colorClass = isIncrease ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
  }

  return (
    <div className={cn('flex items-center gap-1 text-sm font-medium', colorClass)}>
      {isIncrease ? (
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
          <polyline points="18 15 12 9 6 15" />
        </svg>
      ) : (
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
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
      <span>
        {trendAbs.toFixed(1)}%
      </span>
    </div>
  );
}

/**
 * MetricCard Component
 *
 * Renders a dashboard metric card with value, label, icon, and trend.
 *
 * @example
 * ```tsx
 * <MetricCard
 *   label="Total gastado"
 *   value={15250.50}
 *   icon="💰"
 *   trend={12.5}
 *   trendSentiment="negative"
 * />
 *
 * <MetricCard
 *   label="Transacciones"
 *   value={42}
 *   valueType="number"
 *   icon="📊"
 * />
 *
 * <MetricCard
 *   label="Cargando..."
 *   value={0}
 *   isLoading
 * />
 * ```
 */
export function MetricCard({
  label,
  value,
  icon,
  valueType = 'currency',
  trend,
  trendSentiment = 'neutral',
  isLoading = false,
  onClick,
  className,
  variant = 'default',
}: MetricCardProps) {
  const cardClassName = cn(
    'p-6 transition-all hover:shadow-md',
    variant === 'outline' && 'border-2',
    variant === 'ghost' && 'border-0 shadow-none',
    onClick && 'cursor-pointer',
    className
  );

  if (isLoading) {
    return (
      <Card className={cardClassName}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            {icon && <Skeleton className="size-8 rounded-full" />}
          </div>
          <Skeleton className="h-9 w-40" />
          {trend !== undefined && <Skeleton className="h-5 w-20" />}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cardClassName} onClick={onClick}>
      <div className="space-y-2">
        {/* Header: Label + Icon */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {icon && (
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-xl">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-2">
          {formatValue(value, valueType)}
        </div>

        {/* Trend (optional) */}
        {trend !== undefined && <TrendIndicator trend={trend} sentiment={trendSentiment} />}
      </div>
    </Card>
  );
}

/**
 * MetricCard Skeleton (loading state)
 * Standalone skeleton for consistent loading states
 */
export function MetricCardSkeleton({ className }: { className?: string }) {
  return <MetricCard label="" value={0} isLoading className={className} />;
}

/**
 * Compact metric card (no icon, smaller padding)
 * Useful for dense dashboards
 */
export function CompactMetricCard({
  label,
  value,
  valueType = 'currency',
  className,
}: Pick<MetricCardProps, 'label' | 'value' | 'valueType' | 'className'>) {
  return (
    <Card className={cn('p-4', className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-1">{formatValue(value, valueType)}</div>
    </Card>
  );
}
