/**
 * Expense Filters Store (Zustand)
 *
 * Manages UI state for expense filters.
 * This is CLIENT-SIDE UI state only - NOT server data.
 *
 * Default values:
 * - All categories selected (empty array = all)
 * - Date range: Current year
 * - No search query
 * - Sort by date descending (newest first)
 *
 * @module domains/expenses/stores/expense-filters-store
 */

'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ExpenseFiltersState, ExpenseCategory, DateRange, ExpenseSort } from '../types';

/**
 * Get default date range (current year)
 */
function getDefaultDateRange(): DateRange {
  const now = new Date();
  const currentYear = now.getFullYear();

  return {
    from: new Date(`${currentYear}-01-01`),
    to: new Date(`${currentYear}-12-31`),
  };
}

/**
 * Get default sort configuration
 */
function getDefaultSort(): ExpenseSort {
  return {
    field: 'date',
    order: 'desc',
  };
}

/**
 * Expense filters store
 *
 * Manages filter state for the expenses list.
 * This is UI state only - does NOT store expense data.
 */
export const useExpenseFiltersStore = create<ExpenseFiltersState>()(
  devtools(
    (set) => ({
      // State
      selectedCategories: [], // Empty = all categories
      dateRange: getDefaultDateRange(),
      searchQuery: '',
      sort: getDefaultSort(),

      // Actions
      setSelectedCategories: (categories: ExpenseCategory[]) =>
        set(
          { selectedCategories: categories },
          false,
          'setSelectedCategories'
        ),

      setDateRange: (range: DateRange) =>
        set({ dateRange: range }, false, 'setDateRange'),

      setSearchQuery: (query: string) =>
        set({ searchQuery: query }, false, 'setSearchQuery'),

      setSort: (sort: ExpenseSort) => set({ sort }, false, 'setSort'),

      resetFilters: () =>
        set(
          {
            selectedCategories: [],
            dateRange: getDefaultDateRange(),
            searchQuery: '',
            sort: getDefaultSort(),
          },
          false,
          'resetFilters'
        ),
    }),
    {
      name: 'expense-filters-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */

/**
 * Get selected categories
 */
export const useSelectedCategories = () =>
  useExpenseFiltersStore((state) => state.selectedCategories);

/**
 * Get date range filter
 */
export const useDateRange = () =>
  useExpenseFiltersStore((state) => state.dateRange);

/**
 * Get search query
 */
export const useSearchQuery = () =>
  useExpenseFiltersStore((state) => state.searchQuery);

/**
 * Get sort configuration
 */
export const useSort = () => useExpenseFiltersStore((state) => state.sort);

/**
 * Get all filter values as object
 * Use this when you need multiple filter values together
 */
export const useAllFilters = () =>
  useExpenseFiltersStore((state) => ({
    selectedCategories: state.selectedCategories,
    dateRange: state.dateRange,
    searchQuery: state.searchQuery,
    sort: state.sort,
  }));

/**
 * Check if any filters are active (non-default)
 */
export const useHasActiveFilters = () =>
  useExpenseFiltersStore((state) => {
    const hasCategories = state.selectedCategories.length > 0;
    const hasSearch = state.searchQuery.trim().length > 0;

    // Check if date range is different from default (current year)
    const defaultRange = getDefaultDateRange();
    const hasCustomDateRange =
      state.dateRange.from?.getTime() !== defaultRange.from?.getTime() ||
      state.dateRange.to?.getTime() !== defaultRange.to?.getTime();

    // Check if sort is different from default
    const defaultSort = getDefaultSort();
    const hasCustomSort =
      state.sort.field !== defaultSort.field ||
      state.sort.order !== defaultSort.order;

    return hasCategories || hasSearch || hasCustomDateRange || hasCustomSort;
  });
