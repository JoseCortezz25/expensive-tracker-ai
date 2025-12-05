/**
 * ExpenseList Organism Component
 *
 * Displays a list of expenses with loading, empty, and error states.
 * Supports pagination and actions on individual expenses.
 *
 * @module domains/expenses/components/organisms/expense-list
 */

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Expense } from '../../types';
import { ExpenseCard, ExpenseCardSkeleton } from '../molecules/expense-card';
import { expensesTextMap } from '../../expenses.text-map';

export interface ExpenseListProps {
  /**
   * Array of expenses to display
   */
  expenses: Expense[];

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
   * Whether there are more expenses to load
   * @default false
   */
  hasMore?: boolean;

  /**
   * Total count of expenses (for display)
   */
  totalCount?: number;

  /**
   * Load more handler
   */
  onLoadMore?: () => void;

  /**
   * Expense click handler
   */
  onExpenseClick?: (expense: Expense) => void;

  /**
   * Edit expense handler
   */
  onExpenseEdit?: (expense: Expense) => void;

  /**
   * Delete expense handler
   */
  onExpenseDelete?: (expense: Expense) => void;

  /**
   * Retry handler (for error state)
   */
  onRetry?: () => void;

  /**
   * List variant
   * @default 'default'
   */
  variant?: 'default' | 'compact';

  /**
   * Show actions (edit/delete buttons)
   * @default true
   */
  showActions?: boolean;

  /**
   * Empty state component
   */
  emptyState?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Loading skeleton
 */
function ExpenseListSkeleton({ count = 5, variant }: { count?: number; variant?: 'default' | 'compact' }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <ExpenseCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}

/**
 * Empty state
 */
function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
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
      <h3 className="mb-2 text-lg font-semibold">{expensesTextMap.noExpenses}</h3>
      <p className="text-sm text-muted-foreground">{expensesTextMap.noExpensesDescription}</p>
    </div>
  );
}

/**
 * Error state
 */
function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-destructive"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold">{expensesTextMap.errorLoading}</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {error.message || expensesTextMap.errorLoadingDescription}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {expensesTextMap.retry}
        </Button>
      )}
    </div>
  );
}

/**
 * ExpenseList Component
 *
 * Renders a list of expenses with various states and actions.
 *
 * @example
 * ```tsx
 * <ExpenseList
 *   expenses={expenses}
 *   isLoading={isLoading}
 *   hasMore={hasMore}
 *   totalCount={totalCount}
 *   onLoadMore={loadMore}
 *   onExpenseEdit={(expense) => setEditingExpense(expense)}
 *   onExpenseDelete={(expense) => handleDelete(expense.id)}
 * />
 *
 * // Compact variant
 * <ExpenseList
 *   expenses={recentExpenses}
 *   variant="compact"
 *   showActions={false}
 *   onExpenseClick={(expense) => router.push(`/expenses/${expense.id}`)}
 * />
 * ```
 */
export function ExpenseList({
  expenses,
  isLoading = false,
  error = null,
  hasMore = false,
  totalCount,
  onLoadMore,
  onExpenseClick,
  onExpenseEdit,
  onExpenseDelete,
  onRetry,
  variant = 'default',
  showActions = true,
  emptyState,
  className,
}: ExpenseListProps) {
  // Loading state
  if (isLoading && expenses.length === 0) {
    return (
      <div className={className}>
        <ExpenseListSkeleton variant={variant} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <ErrorState error={error} onRetry={onRetry} />
      </div>
    );
  }

  // Empty state
  if (expenses.length === 0) {
    return (
      <div className={className}>
        {emptyState || <DefaultEmptyState />}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Results count */}
      {totalCount !== undefined && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalCount === expenses.length
              ? expensesTextMap.showingResults.replace('{count}', String(expenses.length))
              : expensesTextMap.showingResultsFiltered
                  .replace('{count}', String(expenses.length))
                  .replace('{total}', String(totalCount))}
          </p>
        </div>
      )}

      {/* Expense list */}
      <div className="space-y-3">
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            variant={variant}
            onClick={onExpenseClick ? () => onExpenseClick(expense) : undefined}
            onEdit={showActions && onExpenseEdit ? () => onExpenseEdit(expense) : undefined}
            onDelete={showActions && onExpenseDelete ? () => onExpenseDelete(expense) : undefined}
          />
        ))}
      </div>

      {/* Load more button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
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
                  className="mr-2 animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                {expensesTextMap.loadingMore}
              </>
            ) : (
              expensesTextMap.loadMore
            )}
          </Button>
        </div>
      )}

      {/* No more results indicator */}
      {!hasMore && expenses.length > 5 && (
        <p className="pt-4 text-center text-sm text-muted-foreground">
          {expensesTextMap.noMoreResults}
        </p>
      )}
    </div>
  );
}
