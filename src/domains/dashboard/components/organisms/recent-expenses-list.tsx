/**
 * RecentExpensesList Organism Component
 *
 * Displays a compact list of recent expenses for the dashboard.
 * Lightweight version of ExpenseList optimized for dashboard view.
 *
 * @module domains/dashboard/components/organisms/recent-expenses-list
 */

'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Expense } from '@/domains/expenses/types';
import { ExpenseCard, ExpenseCardSkeleton } from '@/domains/expenses/components/molecules/expense-card';
import { dashboardTextMap } from '../../dashboard.text-map';

export interface RecentExpensesListProps {
  /**
   * Array of recent expenses (typically 5-10)
   */
  expenses: Expense[];

  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Maximum number of expenses to display
   * @default 5
   */
  limit?: number;

  /**
   * View all handler (navigate to expenses page)
   */
  onViewAll?: () => void;

  /**
   * Expense click handler
   */
  onExpenseClick?: (expense: Expense) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Loading skeleton
 */
function RecentExpensesListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <ExpenseCardSkeleton key={index} variant="compact" />
      ))}
    </div>
  );
}

/**
 * Empty state
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      </div>
      <p className="text-sm text-muted-foreground">
        {dashboardTextMap.noRecentExpenses || 'No hay gastos recientes'}
      </p>
    </div>
  );
}

/**
 * RecentExpensesList Component
 *
 * Displays a compact list of recent expenses with a "View All" link.
 *
 * @example
 * ```tsx
 * <RecentExpensesList
 *   expenses={recentExpenses}
 *   limit={5}
 *   onViewAll={() => router.push('/expenses')}
 *   onExpenseClick={(expense) => handleQuickView(expense)}
 * />
 * ```
 */
export function RecentExpensesList({
  expenses,
  isLoading = false,
  limit = 5,
  onViewAll,
  onExpenseClick,
  className,
}: RecentExpensesListProps) {
  // Limit expenses to display
  const displayExpenses = expenses.slice(0, limit);

  // Loading state
  if (isLoading) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-20" />
        </div>
        <RecentExpensesListSkeleton count={limit} />
      </Card>
    );
  }

  return (
    <Card className={cn('p-6', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {dashboardTextMap.recentExpensesHeading || 'Gastos Recientes'}
        </h2>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            {dashboardTextMap.viewAll || 'Ver todos'}
          </Button>
        )}
      </div>

      {/* Empty state */}
      {displayExpenses.length === 0 ? (
        <EmptyState />
      ) : (
        /* Expense list */
        <div className="space-y-3">
          {displayExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              variant="compact"
              showCategory={false}
              showDate={true}
              dateVariant="relative"
              onClick={onExpenseClick ? () => onExpenseClick(expense) : undefined}
            />
          ))}
        </div>
      )}

      {/* View all footer (if more expenses available) */}
      {expenses.length > limit && onViewAll && (
        <div className="mt-4 flex justify-center border-t pt-4">
          <Button variant="outline" size="sm" onClick={onViewAll} className="w-full sm:w-auto">
            {dashboardTextMap.viewAllExpenses || `Ver todos (${expenses.length})`}
          </Button>
        </div>
      )}
    </Card>
  );
}
