/**
 * DashboardMetrics Organism Component
 *
 * Displays the 4 key dashboard metrics in a responsive grid.
 * Composes MetricCard molecules with calculated values.
 *
 * @module domains/dashboard/components/organisms/dashboard-metrics
 */

'use client';

import * as React from 'react';
import { DollarSign, TrendingUp, FolderOpen, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricCard, MetricCardSkeleton } from '../molecules/metric-card';
import { dashboardTextMap } from '../../dashboard.text-map';

export interface DashboardMetricsData {
  /**
   * Total amount spent
   */
  totalSpent: number;

  /**
   * Average daily spending
   */
  averageDaily: number;

  /**
   * Top spending category
   */
  topCategory: {
    name: string;
    amount: number;
    Icon?: React.ComponentType<{ className?: string }>;
  } | null;

  /**
   * Total transaction count
   */
  transactionCount: number;

  /**
   * Trend data (optional)
   */
  trends?: {
    totalSpent?: number;
    averageDaily?: number;
    transactionCount?: number;
  };
}

export interface DashboardMetricsProps {
  /**
   * Metrics data
   */
  data?: DashboardMetricsData;

  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Error state
   */
  error?: Error | null;

  /**
   * Metric click handler (for navigation/details)
   */
  onMetricClick?: (metric: 'totalSpent' | 'averageDaily' | 'topCategory' | 'transactionCount') => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Default/Empty metrics data
 */
const emptyMetrics: DashboardMetricsData = {
  totalSpent: 0,
  averageDaily: 0,
  topCategory: null,
  transactionCount: 0,
};

/**
 * DashboardMetrics Component
 *
 * Renders 4 key metrics in a responsive grid layout.
 *
 * @example
 * ```tsx
 * const metricsData = {
 *   totalSpent: 15250.50,
 *   averageDaily: 508.35,
 *   topCategory: {
 *     name: 'Comida',
 *     amount: 6200.00,
 *     icon: '🍕'
 *   },
 *   transactionCount: 42,
 *   trends: {
 *     totalSpent: 12.5,
 *     averageDaily: -5.2,
 *     transactionCount: 8.0
 *   }
 * };
 *
 * <DashboardMetrics
 *   data={metricsData}
 *   onMetricClick={(metric) => console.log('Clicked:', metric)}
 * />
 * ```
 */
export function DashboardMetrics({
  data,
  isLoading = false,
  error = null,
  onMetricClick,
  className,
}: DashboardMetricsProps) {
  const metrics = data || emptyMetrics;

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
        <div className="col-span-full rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm font-medium text-destructive">
            {dashboardTextMap.errorLoadingMetrics || 'Error al cargar métricas'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  const TopCategoryIcon = metrics.topCategory?.Icon || FolderOpen;

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {/* Total Spent */}
      <MetricCard
        label={dashboardTextMap.metricTotalSpent || 'Total Gastado'}
        value={metrics.totalSpent}
        icon={<DollarSign className="size-5" />}
        valueType="currency"
        trend={metrics.trends?.totalSpent}
        trendSentiment="negative"
        className={onMetricClick ? 'cursor-pointer transition-transform hover:scale-105' : undefined}
        onClick={() => onMetricClick?.('totalSpent')}
      />

      {/* Average Daily */}
      <MetricCard
        label={dashboardTextMap.metricAverageDaily || 'Promedio Diario'}
        value={metrics.averageDaily}
        icon={<TrendingUp className="size-5" />}
        valueType="currency"
        trend={metrics.trends?.averageDaily}
        trendSentiment="negative"
        className={onMetricClick ? 'cursor-pointer transition-transform hover:scale-105' : undefined}
        onClick={() => onMetricClick?.('averageDaily')}
      />

      {/* Top Category */}
      <MetricCard
        label={dashboardTextMap.metricTopCategory || 'Categoría Principal'}
        value={metrics.topCategory?.amount || 0}
        icon={<TopCategoryIcon className="size-5" />}
        valueType="currency"
        className={onMetricClick ? 'cursor-pointer transition-transform hover:scale-105' : undefined}
        onClick={() => onMetricClick?.('topCategory')}
      />

      {/* Transaction Count */}
      <MetricCard
        label={dashboardTextMap.metricTransactionCount || 'Transacciones'}
        value={metrics.transactionCount}
        icon={<Receipt className="size-5" />}
        valueType="number"
        trend={metrics.trends?.transactionCount}
        trendSentiment="neutral"
        className={onMetricClick ? 'cursor-pointer transition-transform hover:scale-105' : undefined}
        onClick={() => onMetricClick?.('transactionCount')}
      />
    </div>
  );
}

/**
 * Compact metrics layout (2 columns max)
 * Useful for smaller viewports or sidebar
 */
export function CompactDashboardMetrics({
  data,
  isLoading,
  className,
}: Pick<DashboardMetricsProps, 'data' | 'isLoading' | 'className'>) {
  const metrics = data || emptyMetrics;

  if (isLoading) {
    return (
      <div className={cn('grid gap-3 grid-cols-2', className)}>
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }

  const TopCategoryIcon = metrics.topCategory?.Icon || FolderOpen;

  return (
    <div className={cn('grid gap-3 grid-cols-2', className)}>
      <MetricCard
        label={dashboardTextMap.metricTotalSpent || 'Total'}
        value={metrics.totalSpent}
        icon={<DollarSign className="size-4" />}
        valueType="currency"
        variant="outline"
      />
      <MetricCard
        label={dashboardTextMap.metricAverageDaily || 'Promedio'}
        value={metrics.averageDaily}
        icon={<TrendingUp className="size-4" />}
        valueType="currency"
        variant="outline"
      />
      <MetricCard
        label={dashboardTextMap.metricTopCategory || 'Top'}
        value={metrics.topCategory?.amount || 0}
        icon={<TopCategoryIcon className="size-4" />}
        valueType="currency"
        variant="outline"
      />
      <MetricCard
        label={dashboardTextMap.metricTransactionCount || 'Total'}
        value={metrics.transactionCount}
        icon={<Receipt className="size-4" />}
        valueType="number"
        variant="outline"
      />
    </div>
  );
}
