/**
 * ExpenseCard Molecule Component
 *
 * Displays a single expense item with description, amount, category, and date.
 * Composes atoms: ExpenseAmount, ExpenseDate, CategoryBadge.
 *
 * @module domains/expenses/components/molecules/expense-card
 */

'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Expense } from '../../types';
import { ExpenseAmount } from '../atoms/expense-amount';
import { ExpenseDate, RelativeDate } from '../atoms/expense-date';
import { CategoryBadge, CategoryIcon } from '../atoms/category-badge';

export interface ExpenseCardProps {
  /**
   * Expense data
   */
  expense: Expense;

  /**
   * Layout variant
   * @default 'default'
   */
  variant?: 'default' | 'compact' | 'detailed';

  /**
   * Show category badge
   * @default true
   */
  showCategory?: boolean;

  /**
   * Show date
   * @default true
   */
  showDate?: boolean;

  /**
   * Date format variant
   * @default 'relative'
   */
  dateVariant?: 'short' | 'long' | 'numeric' | 'relative';

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Delete handler (shows delete button)
   */
  onDelete?: () => void;

  /**
   * Edit handler (shows edit button)
   */
  onEdit?: () => void;

  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Action buttons (edit/delete)
 */
function ActionButtons({
  onEdit,
  onDelete,
}: Pick<ExpenseCardProps, 'onEdit' | 'onDelete'>) {
  return (
    <div className="flex gap-1">
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Editar gasto"
          title="Editar"
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
          >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Eliminar gasto"
          title="Eliminar"
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
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * ExpenseCard - Default variant
 */
function DefaultExpenseCard({
  expense,
  showCategory,
  showDate,
  dateVariant,
  onClick,
  onEdit,
  onDelete,
  className,
}: ExpenseCardProps) {
  return (
    <Card
      className={cn(
        'p-4 transition-all hover:shadow-md',
        onClick && 'cursor-pointer hover:border-primary/50',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Icon + Content */}
        <div className="flex flex-1 gap-3">
          {/* Category Icon */}
          <div className="mt-0.5">
            <CategoryIcon category={expense.category} />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1.5">
            <p className="font-medium leading-tight">{expense.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              {showCategory && <CategoryBadge category={expense.category} size="sm" showIcon={false} />}
              {showDate && (
                <ExpenseDate
                  date={expense.date}
                  variant={dateVariant}
                  size="sm"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: Amount + Actions */}
        <div className="flex flex-col items-end gap-2">
          <ExpenseAmount amount={expense.amount} size="lg" />
          {(onEdit || onDelete) && <ActionButtons onEdit={onEdit} onDelete={onDelete} />}
        </div>
      </div>
    </Card>
  );
}

/**
 * ExpenseCard - Compact variant
 */
function CompactExpenseCard({
  expense,
  showCategory,
  showDate,
  onClick,
  className,
}: ExpenseCardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <CategoryIcon category={expense.category} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{expense.description}</p>
          {showDate && <RelativeDate date={expense.date} className="text-xs" />}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {showCategory && <CategoryIcon category={expense.category} />}
        <ExpenseAmount amount={expense.amount} size="md" />
      </div>
    </div>
  );
}

/**
 * ExpenseCard - Detailed variant
 */
function DetailedExpenseCard({
  expense,
  showCategory,
  showDate,
  onClick,
  onEdit,
  onDelete,
  className,
}: ExpenseCardProps) {
  return (
    <Card
      className={cn(
        'p-6 transition-all hover:shadow-md',
        onClick && 'cursor-pointer hover:border-primary/50',
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
              <CategoryIcon category={expense.category} />
            </div>
            <div>
              <h3 className="font-semibold">{expense.description}</h3>
              {showCategory && (
                <CategoryBadge category={expense.category} className="mt-1" />
              )}
            </div>
          </div>
          {(onEdit || onDelete) && <ActionButtons onEdit={onEdit} onDelete={onDelete} />}
        </div>

        {/* Amount */}
        <div className="flex items-baseline gap-2">
          <ExpenseAmount amount={expense.amount} size="xl" />
        </div>

        {/* Metadata */}
        {showDate && (
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">Fecha:</span>
              <ExpenseDate date={expense.date} variant="long" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Creado:</span>
              <RelativeDate date={expense.createdAt} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * ExpenseCard Component
 *
 * Renders an expense with configurable layout and actions.
 *
 * @example
 * ```tsx
 * <ExpenseCard expense={expense} />
 *
 * <ExpenseCard
 *   expense={expense}
 *   variant="compact"
 *   onClick={() => handleView(expense.id)}
 * />
 *
 * <ExpenseCard
 *   expense={expense}
 *   variant="detailed"
 *   onEdit={() => handleEdit(expense.id)}
 *   onDelete={() => handleDelete(expense.id)}
 * />
 * ```
 */
export function ExpenseCard({
  expense,
  variant = 'default',
  showCategory = true,
  showDate = true,
  dateVariant = 'relative',
  onClick,
  onDelete,
  onEdit,
  isLoading = false,
  className,
}: ExpenseCardProps) {
  if (isLoading) {
    return <ExpenseCardSkeleton variant={variant} className={className} />;
  }

  const props: ExpenseCardProps = {
    expense,
    showCategory,
    showDate,
    dateVariant,
    onClick,
    onEdit,
    onDelete,
    className,
  };

  switch (variant) {
    case 'compact':
      return <CompactExpenseCard {...props} />;
    case 'detailed':
      return <DetailedExpenseCard {...props} />;
    case 'default':
    default:
      return <DefaultExpenseCard {...props} />;
  }
}

/**
 * ExpenseCard Skeleton (loading state)
 */
export function ExpenseCardSkeleton({
  variant = 'default',
  className,
}: Pick<ExpenseCardProps, 'variant' | 'className'>) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center justify-between gap-3 rounded-lg border bg-card p-3', className)}>
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
    );
  }

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 gap-3">
          <Skeleton className="mt-0.5 size-6 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-7 w-24" />
      </div>
    </Card>
  );
}
