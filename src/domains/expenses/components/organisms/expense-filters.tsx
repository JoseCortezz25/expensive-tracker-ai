/**
 * ExpenseFilters Organism Component
 *
 * Complete filtering interface for expenses.
 * Includes search, date range, categories, and sort controls.
 *
 * @module domains/expenses/components/organisms/expense-filters
 */

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ExpenseCategory, DateRange, ExpenseSort } from '../../types';
import { EXPENSE_CATEGORIES } from '../../types';
import { SearchBar } from '../molecules/search-bar';
import { ExpenseDateRangePicker } from '../molecules/date-range-picker';
import { CategoryBadge, getCategoryIconComponent } from '../atoms/category-badge';
import { expensesTextMap } from '../../expenses.text-map';

export interface ExpenseFiltersProps {
  /**
   * Selected categories
   */
  selectedCategories: ExpenseCategory[];

  /**
   * Date range
   */
  dateRange?: DateRange;

  /**
   * Search query
   */
  searchQuery: string;

  /**
   * Sort configuration
   */
  sort: ExpenseSort;

  /**
   * Category change handler
   */
  onCategoriesChange: (categories: ExpenseCategory[]) => void;

  /**
   * Date range change handler
   */
  onDateRangeChange: (range: DateRange) => void;

  /**
   * Search query change handler
   */
  onSearchQueryChange: (query: string) => void;

  /**
   * Sort change handler
   */
  onSortChange: (sort: ExpenseSort) => void;

  /**
   * Reset filters handler
   */
  onResetFilters: () => void;

  /**
   * Whether any filters are active
   */
  hasActiveFilters?: boolean;

  /**
   * Layout variant
   * @default 'full'
   */
  variant?: 'full' | 'compact';

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Category filter buttons
 */
function CategoryFilters({
  selectedCategories,
  onCategoriesChange,
}: Pick<ExpenseFiltersProps, 'selectedCategories' | 'onCategoriesChange'>) {
  const toggleCategory = (category: ExpenseCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const isAllSelected = selectedCategories.length === 0;

  return (
    <div className="space-y-3">
      <Label>{expensesTextMap.filterByCategory}</Label>
      <div className="flex flex-wrap gap-2">
        {/* All categories button */}
        <Button
          variant={isAllSelected ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoriesChange([])}
        >
          {expensesTextMap.allCategories}
        </Button>

        {/* Individual category buttons */}
        {EXPENSE_CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category);
          const Icon = getCategoryIconComponent(category);
          return (
            <Button
              key={category}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleCategory(category)}
              className="gap-1.5"
            >
              <Icon className="size-4" />
              <span>{expensesTextMap[`category${category}` as keyof typeof expensesTextMap]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Sort controls
 */
function SortControls({
  sort,
  onSortChange,
}: Pick<ExpenseFiltersProps, 'sort' | 'onSortChange'>) {
  const sortOptions: Array<{ value: string; label: string; field: ExpenseSort['field']; order: ExpenseSort['order'] }> = [
    { value: 'date-desc', label: expensesTextMap.sortByDateDesc, field: 'date', order: 'desc' },
    { value: 'date-asc', label: expensesTextMap.sortByDateAsc, field: 'date', order: 'asc' },
    { value: 'amount-desc', label: expensesTextMap.sortByAmountDesc, field: 'amount', order: 'desc' },
    { value: 'amount-asc', label: expensesTextMap.sortByAmountAsc, field: 'amount', order: 'asc' },
  ];

  const currentValue = `${sort.field}-${sort.order}`;

  return (
    <div className="space-y-2">
      <Label>{expensesTextMap.sortBy}</Label>
      <Select
        value={currentValue}
        onValueChange={(value) => {
          const option = sortOptions.find((opt) => opt.value === value);
          if (option) {
            onSortChange({ field: option.field, order: option.order });
          }
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * ExpenseFilters Component
 *
 * Complete filtering interface with search, date range, categories, and sort.
 *
 * @example
 * ```tsx
 * const {
 *   selectedCategories,
 *   dateRange,
 *   searchQuery,
 *   sort,
 *   setSelectedCategories,
 *   setDateRange,
 *   setSearchQuery,
 *   setSort,
 *   resetFilters
 * } = useExpenseFilters();
 *
 * <ExpenseFilters
 *   selectedCategories={selectedCategories}
 *   dateRange={dateRange}
 *   searchQuery={searchQuery}
 *   sort={sort}
 *   onCategoriesChange={setSelectedCategories}
 *   onDateRangeChange={setDateRange}
 *   onSearchQueryChange={setSearchQuery}
 *   onSortChange={setSort}
 *   onResetFilters={resetFilters}
 * />
 * ```
 */
export function ExpenseFilters({
  selectedCategories,
  dateRange,
  searchQuery,
  sort,
  onCategoriesChange,
  onDateRangeChange,
  onSearchQueryChange,
  onSortChange,
  onResetFilters,
  hasActiveFilters = false,
  variant = 'full',
  className,
}: ExpenseFiltersProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Search + Reset */}
        <div className="flex gap-2">
          <SearchBar
            value={searchQuery}
            onChange={onSearchQueryChange}
            className="flex-1"
          />
          {hasActiveFilters && (
            <Button variant="outline" onClick={onResetFilters}>
              {expensesTextMap.clearFilters}
            </Button>
          )}
        </div>

        {/* Date Range + Sort */}
        <div className="grid gap-4 sm:grid-cols-2">
          <ExpenseDateRangePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
          <SortControls sort={sort} onSortChange={onSortChange} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search */}
      <div className="space-y-2">
        <Label>{expensesTextMap.searchByDescription}</Label>
        <SearchBar
          value={searchQuery}
          onChange={onSearchQueryChange}
        />
      </div>

      <Separator />

      {/* Date Range */}
      <div className="space-y-2">
        <Label>{expensesTextMap.filterByDateRange}</Label>
        <ExpenseDateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </div>

      <Separator />

      {/* Categories */}
      <CategoryFilters
        selectedCategories={selectedCategories}
        onCategoriesChange={onCategoriesChange}
      />

      <Separator />

      {/* Sort */}
      <SortControls sort={sort} onSortChange={onSortChange} />

      {/* Reset button */}
      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="w-full"
          >
            {expensesTextMap.clearFilters}
          </Button>
        </>
      )}
    </div>
  );
}
