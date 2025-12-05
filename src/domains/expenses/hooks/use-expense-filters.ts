/**
 * useExpenseFilters Hook
 *
 * Custom hook for managing expense filter state.
 * Wraps the Zustand store with a simpler API.
 *
 * @module domains/expenses/hooks/use-expense-filters
 */

'use client';

import { useExpenseFiltersStore, useHasActiveFilters as _useHasActiveFilters } from '../stores/expense-filters-store';
import type { ExpenseCategory, DateRange, ExpenseSort, ExpenseFiltersState } from '../types';

// Re-export useHasActiveFilters from store
export { _useHasActiveFilters as useHasActiveFilters };

/**
 * Hook for managing expense filters
 *
 * Provides a simplified interface to the filter store.
 * All state changes trigger re-renders automatically.
 *
 * @returns Filter state and actions
 *
 * @example
 * ```typescript
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
 * // Update category filter
 * setSelectedCategories(['Comida', 'Transporte']);
 *
 * // Update date range
 * setDateRange({
 *   from: new Date('2025-01-01'),
 *   to: new Date('2025-12-31')
 * });
 *
 * // Reset all filters
 * resetFilters();
 * ```
 */
export function useExpenseFilters() {
  const selectedCategories = useExpenseFiltersStore(
    (state: ExpenseFiltersState) => state.selectedCategories
  );
  const dateRange = useExpenseFiltersStore((state: ExpenseFiltersState) => state.dateRange);
  const searchQuery = useExpenseFiltersStore((state: ExpenseFiltersState) => state.searchQuery);
  const sort = useExpenseFiltersStore((state: ExpenseFiltersState) => state.sort);

  const setSelectedCategories = useExpenseFiltersStore(
    (state: ExpenseFiltersState) => state.setSelectedCategories
  );
  const setDateRange = useExpenseFiltersStore((state: ExpenseFiltersState) => state.setDateRange);
  const setSearchQuery = useExpenseFiltersStore(
    (state: ExpenseFiltersState) => state.setSearchQuery
  );
  const setSort = useExpenseFiltersStore((state: ExpenseFiltersState) => state.setSort);
  const resetFilters = useExpenseFiltersStore((state: ExpenseFiltersState) => state.resetFilters);

  return {
    selectedCategories,
    dateRange,
    searchQuery,
    sort,
    setSelectedCategories,
    setDateRange,
    setSearchQuery,
    setSort,
    resetFilters,
  };
}

/**
 * Hook to get only filter values (no actions)
 * Useful for read-only contexts
 */
export function useExpenseFilterValues() {
  return {
    selectedCategories: useExpenseFiltersStore(
      (state: ExpenseFiltersState) => state.selectedCategories
    ),
    dateRange: useExpenseFiltersStore((state: ExpenseFiltersState) => state.dateRange),
    searchQuery: useExpenseFiltersStore((state: ExpenseFiltersState) => state.searchQuery),
    sort: useExpenseFiltersStore((state: ExpenseFiltersState) => state.sort),
  };
}

/**
 * Hook to get only filter actions (no state)
 * Useful when you don't need to trigger re-renders on state changes
 */
export function useExpenseFilterActions() {
  return {
    setSelectedCategories: useExpenseFiltersStore(
      (state: ExpenseFiltersState) => state.setSelectedCategories
    ),
    setDateRange: useExpenseFiltersStore((state: ExpenseFiltersState) => state.setDateRange),
    setSearchQuery: useExpenseFiltersStore((state: ExpenseFiltersState) => state.setSearchQuery),
    setSort: useExpenseFiltersStore((state: ExpenseFiltersState) => state.setSort),
    resetFilters: useExpenseFiltersStore((state: ExpenseFiltersState) => state.resetFilters),
  };
}
